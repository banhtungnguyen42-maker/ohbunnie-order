import { useState, useEffect, useRef } from 'react';
import { META, BANK, API_URL } from '../data/products';
import { money, genOId } from '../utils';

export default function OrderSection({ cart, editingId, setEditingId, onEdit, onRemove, onClearCart }) {
  // form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [receiveDate, setReceiveDate] = useState('');
  const [address, setAddress] = useState('');
  const [loyaltyEmail, setLoyaltyEmail] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt khi nhận hàng');
  const [transferStatus, setTransferStatus] = useState('Chưa chuyển khoản');
  const [paymentRef, setPaymentRef] = useState('');

  // loyalty
  const [loyaltyCache, setLoyaltyCache] = useState({ email: '', count: 0, eligible: false, checked: false });
  const [loyaltyStatus, setLoyaltyStatus] = useState('');
  const loyaltyTimer = useRef(null);

  // order status / loading
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // bank content preview
  const [previewId] = useState(() => genOId());

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + today.getDate()).slice(-2)}`;

  const bankContent = `${name || '[Tên]'} ${phone || '[SĐT]'} ${previewId}`;
  const tempTotal = cart.reduce((s, i) => s + i.lineTotal, 0);
  const eligible = loyaltyCache.checked && loyaltyCache.eligible;
  const discount = (eligible && tempTotal >= 40000) ? Math.min(Math.round(tempTotal * 0.05), 50000) : 0;
  const finalTotal = tempTotal - discount;
  const hasCake = cart.some(i => i.type === 'cake_quote');

  // --- Loyalty check ---
  const checkLoyalty = async (email) => {
    const el = email.trim().toLowerCase();
    if (!el || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el)) {
      setLoyaltyCache({ email: '', count: 0, eligible: false, checked: false });
      setLoyaltyStatus('');
      return;
    }
    if (loyaltyCache.checked && loyaltyCache.email === el) return;

    setLoyaltyStatus('<div class="lbox checking">⏳ Đang kiểm tra điểm...</div>');
    try {
      const res = await fetch(`${API_URL}?action=loyalty&email=${encodeURIComponent(el)}`, {
        redirect: 'follow',
      });
      const data = await res.json();
      setLoyaltyCache({ email: el, count: data.count, eligible: data.eligible, checked: true });
      setLoyaltyStatus(
        data.eligible
          ? `<div class="lbox eligible">🎉 Đã tích đủ ${data.count} lần ! Được giảm 5% ✨</div>`
          : `<div class="lbox progress">⭐ Đã tích: ${data.count}/5 — còn ${5 - data.count} lần nữa !</div>`
      );
    } catch {
      setLoyaltyCache({ email: '', count: 0, eligible: false, checked: false });
      setLoyaltyStatus('');
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setLoyaltyEmail(val);
    clearTimeout(loyaltyTimer.current);
    setLoyaltyCache({ email: '', count: 0, eligible: false, checked: false });
    setLoyaltyStatus('');
    loyaltyTimer.current = setTimeout(() => checkLoyalty(val), 800);
  };

  // --- Summary groups ---
  const groups = [];
  const seen = new Set();
  cart.forEach(item => {
    const gid = item.editGroup || item.id;
    if (!seen.has(gid)) { seen.add(gid); groups.push(gid); }
  });

  const copyText = async (text, btn) => {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = '✅ Đã copy!';
    setTimeout(() => (btn.textContent = orig), 2000);
  };

  // --- Submit ---
  const submitOrder = async () => {
    if (!name || !phone || !receiveDate || !address) {
      setStatus('Vui lòng điền đủ thông tin nhận hàng.');
      return;
    }
    const chosen = new Date(receiveDate);
    chosen.setHours(0, 0, 0, 0);
    const tod = new Date(); tod.setHours(0, 0, 0, 0);
    if (chosen < tod) { setStatus('Vui lòng chọn ngày nhận hàng từ hôm nay trở đi.'); return; }
    if (!cart.length) { setStatus('Bạn chưa chọn sản phẩm nào.'); return; }

    const lines = cart.map(i => ({
      item_type: i.type, product: i.name, size: i.size || '', flavor: i.flavor || '',
      quantity: i.qty, unit_price: i.unitPrice, line_total: i.lineTotal,
      config: i.config || '', note: i.note || '',
    }));
    const pm = paymentMethod;
    const ps = pm === 'Tiền mặt khi nhận hàng'
      ? 'Chưa thanh toán'
      : (transferStatus === 'Đã chuyển khoản' ? 'Đã thanh toán' : 'Chưa thanh toán');

    const data = {
      customer: { name, phone, receiveDate, address, email: loyaltyEmail.trim(), note: customerNote },
      payment: { method: pm, status: ps, ref: paymentRef },
      lines, tempTotal, hasCake,
      finalNote: hasCake ? 'Có bánh sinh nhật, shop báo giá sau.' : 'Đã tính đủ.',
    };

    setLoading(true);
    setStatus('⏳ Đang gửi đơn...');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || 'Lỗi không xác định');

      let msg = `✅ Đặt đơn thành công ! Mã đơn: <b>${result.orderId}</b>`;
      if (result.loyaltyUsed && result.discount > 0)
        msg += `<br>🎉 Giảm thân thiết: <b>-${money(result.discount)}</b>`;
      else if (!result.loyaltyUsed && result.loyaltyCount !== undefined) {
        const nc = result.loyaltyCount + 1;
        if (nc < 5 && tempTotal >= 40000) msg += `<br>⭐ Đã tích lần ${nc}/5 !`;
      }
      setStatus(msg);
      onClearCart();
      setName(''); setPhone(''); setReceiveDate(''); setAddress('');
      setLoyaltyEmail(''); setCustomerNote(''); setPaymentRef('');
      setPaymentMethod('Tiền mặt khi nhận hàng');
      setTransferStatus('Chưa chuyển khoản');
      setLoyaltyCache({ email: '', count: 0, eligible: false, checked: false });
      setLoyaltyStatus('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('❌ Lỗi: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="sec" style={{ background: 'var(--cream)', borderTop: '1px solid var(--line)' }}>
      <span className="sec-tag rev">Thông tin đặt hàng</span>
      <h2 className="sec-title rev d1">Điền thông tin nhận hàng</h2>
      <p className="sec-sub rev d2" style={{ marginBottom: 28 }}>Kiểm tra lại giỏ hàng và điền thông tin bên dưới nhé !</p>

      <div className="order-grid">
        {/* LEFT */}
        <div>
          <div className="card rev">
            <h2>Thông tin nhận hàng</h2>
            <div className="field">
              <label className="lbl">Họ và tên</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Họ và tên" />
            </div>
            <div className="row2">
              <div className="field">
                <label className="lbl">Số điện thoại</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="SĐT" />
              </div>
              <div className="field">
                <label className="lbl">Ngày nhận hàng</label>
                <input type="date" value={receiveDate} min={todayStr}
                  onChange={e => {
                    const chosen = new Date(e.target.value); chosen.setHours(0, 0, 0, 0);
                    const tod = new Date(); tod.setHours(0, 0, 0, 0);
                    if (chosen < tod) { alert('Vui lòng chọn ngày từ hôm nay trở đi nhé!'); return; }
                    setReceiveDate(e.target.value);
                  }}
                />
                <p className="helper">Từ hôm nay trở đi.</p>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Địa chỉ nhận hàng</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ / điểm nhận hàng" />
            </div>
            <div className="field">
              <label className="lbl">Email <span className="opt">(không bắt buộc — tích điểm)</span></label>
              <input type="email" value={loyaltyEmail} onChange={handleEmailChange} placeholder="email@example.com" />
              <p className="helper">📮 Tích đủ 5 đơn từ 40.000đ → giảm 5% (tối đa 50.000đ) lần sau !</p>
              {loyaltyStatus && <div dangerouslySetInnerHTML={{ __html: loyaltyStatus }} />}
            </div>
            <div className="field">
              <label className="lbl">Ghi chú <span className="opt">(không bắt buộc)</span></label>
              <textarea value={customerNote} onChange={e => setCustomerNote(e.target.value)} placeholder="Ghi chú thêm cho shop..." />
            </div>
          </div>

          <div className="card rev">
            <h2>Thanh toán</h2>
            <div className="field">
              <label className="lbl">Phương thức thanh toán</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option>Tiền mặt khi nhận hàng</option>
                <option>Chuyển khoản</option>
              </select>
            </div>

            {paymentMethod === 'Chuyển khoản' && (
              <div>
                <div className="bank-box">
                  <div className="bank-lbl">🏦 {BANK.bank}</div>
                  <div className="bank-num">{BANK.number}</div>
                  <div className="bank-own">{BANK.owner}</div>
                  <div className="bank-cn">Nội dung chuyển khoản (bấm copy):</div>
                  <div className="bank-cv">{bankContent}</div>
                  <div className="bank-btns">
                    <button type="button" className="copy-btn" onClick={e => copyText(BANK.number.replace(/\s/g, ''), e.currentTarget)}>📋 Copy STK</button>
                    <button type="button" className="copy-btn" onClick={e => copyText(bankContent, e.currentTarget)}>📋 Copy nội dung CK</button>
                  </div>
                </div>
                <div className="field" style={{ marginTop: 12 }}>
                  <label className="lbl">Trạng thái chuyển khoản</label>
                  <select value={transferStatus} onChange={e => setTransferStatus(e.target.value)}>
                    <option>Chưa chuyển khoản</option>
                    <option>Đã chuyển khoản</option>
                  </select>
                </div>
              </div>
            )}

            <div className="field" style={{ marginTop: 10 }}>
              <label className="lbl">Ghi chú thanh toán <span className="opt">(không bắt buộc)</span></label>
              <input type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} placeholder="Tên người chuyển / thời gian (nếu có)" />
              <p className="helper">
                {paymentMethod === 'Chuyển khoản'
                  ? 'Vui lòng CK theo thông tin trên, ghi đúng nội dung.'
                  : 'Nếu chọn tiền mặt, đơn sẽ mặc định là chưa thanh toán.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – checkout summary */}
        <div className="checkout">
          <div className="co-card rev">
            <h2>Tóm tắt đơn</h2>

            {/* Summary items */}
            {groups.length === 0 ? (
              <div className="s-empty">Chưa có món nào.<br />Chọn món ở phía trên nhé!</div>
            ) : (
              groups.map(gid => {
                const items = cart.filter(i => (i.editGroup || i.id) === gid);
                const main = items[0];
                const m = META[main.pKey];
                const emoji = m ? m.emoji : (main.type === 'gift' ? '🎁' : '📦');
                const groupTotal = items.reduce((s, i) => s + i.lineTotal, 0);
                const isEditing = editingId === gid;
                let detail = '';
                if (main.type === 'jar') {
                  const ji = items.filter(i => i.type === 'jar');
                  const gi = items.filter(i => i.type === 'gift');
                  detail = ji.map(i => `${i.flavor} x${i.qty}`).join(', ');
                  if (gi.length) detail += ` + 🎁 ${gi.map(i => i.flavor).join(', ')}`;
                } else {
                  detail = [main.size, main.flavor, main.config].filter(Boolean).join(' · ');
                }
                const tq = items.filter(i => i.type !== 'gift').reduce((s, i) => s + i.qty, 0);
                const prText = groupTotal ? money(groupTotal) : 'Báo giá';

                return (
                  <div key={gid} className={`s-item${isEditing ? ' editing' : ''}`}>
                    <div className="si-top">
                      <div className="si-img">{emoji}</div>
                      <div className="si-info">
                        <div className="si-name">{main.name}</div>
                        {detail && <div className="si-det">{detail}</div>}
                      </div>
                      <div className="si-acts">
                        <button type="button" className="si-rm" onClick={() => onRemove(main.id)}>×</button>
                        {main.type !== 'gift' && (
                          isEditing
                            ? <button type="button" className="si-eb ac" disabled>✏️ Đang sửa...</button>
                            : <button type="button" className="si-eb" onClick={() => onEdit(gid)}>✏️ Sửa</button>
                        )}
                      </div>
                    </div>
                    <div className="si-bot">
                      <span style={{ fontSize: 12, color: 'var(--brown2)' }}>x{tq}</span>
                      <div className="si-pr">{prText}</div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Totals */}
            {eligible && tempTotal >= 40000 && (
              <>
                <div className="s-div disc"><span>🎉 Giảm tích điểm (5%)</span><span>-{money(discount)}</span></div>
                <div className="s-div"><span>Thực trả</span><span>{money(finalTotal)}</span></div>
              </>
            )}
            {hasCake && <div style={{ fontSize: 12, color: 'var(--brown2)', marginTop: 8 }}>* Bánh sinh nhật shop sẽ báo giá sau.</div>}

            <div className="tot-amt">{money(finalTotal)}</div>

            <button
              type="button"
              className="btn-order"
              onClick={submitOrder}
              disabled={loading}
            >
              {loading ? '⏳ Đang gửi...' : 'Gửi đơn ✦'}
            </button>

            {status && (
              <div className="order-st" dangerouslySetInnerHTML={{ __html: status }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
