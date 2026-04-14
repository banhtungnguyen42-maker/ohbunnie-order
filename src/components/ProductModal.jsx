import { useState, useEffect } from 'react';
import { FLAVORS, META } from '../data/products';
import { money, genId, FlavorIcon } from '../utils';
import FlavorSubModal from './FlavorSubModal';

function initMState(meta) {
  const jarQty = {};
  FLAVORS.forEach(f => (jarQty[f.key] = 0));
  return {
    jarQty,
    slots: meta?.type === 'set' ? Array(meta.slots).fill(null) : [],
    qty: 0,
    swap: 'Không',
    cakeFlavor: '',
  };
}

export default function ProductModal({ open, productKey, editingId, cartItems, onClose, onConfirm }) {
  const meta = META[productKey] || null;
  const [mState, setMState] = useState(() => initMState(meta));
  const [note, setNote] = useState('');
  // cake fields
  const [cakeSz, setCakeSz] = useState('');
  const [cakeWr, setCakeWr] = useState('Không');
  const [cakeTxt, setCakeTxt] = useState('');
  const [cakeTheme, setCakeTheme] = useState('');
  const [cakeDetail, setCakeDetail] = useState('');
  // gift selections
  const [gift1, setGift1] = useState('none');
  const [gift2, setGift2] = useState('none');
  // sub modal
  const [subModal, setSubModal] = useState({ open: false, slotIdx: -1, title: '' });

  // reset when product changes
  useEffect(() => {
    if (!meta) return;
    setMState(initMState(meta));
    setNote(''); setCakeSz(''); setCakeWr('Không');
    setCakeTxt(''); setCakeTheme(''); setCakeDetail('');
    setGift1('none'); setGift2('none');
  }, [productKey]);

  // prefill when editing
  useEffect(() => {
    if (!editingId || !meta || !cartItems) return;
    const items = cartItems.filter(i => i.editGroup === editingId || i.id === editingId);
    if (!items.length) return;
    const main = items[0];
    if (meta.type === 'jar') {
      const newQty = {};
      FLAVORS.forEach(f => (newQty[f.key] = 0));
      items.filter(i => i.type === 'jar').forEach(item => {
        const f = FLAVORS.find(x => x.name === item.flavor);
        if (f) newQty[f.key] = item.qty;
      });
      setMState(s => ({ ...s, jarQty: newQty }));
      setNote(main.note || '');
    } else if (meta.type === 'set') {
      const newSlots = Array(meta.slots).fill(null);
      (main.config || '').split('|').forEach(p => {
        const m = p.trim().match(/^Ô(\d+):(.+)$/);
        if (m) {
          const i = parseInt(m[1]) - 1;
          const fn = m[2].trim();
          if (i >= 0 && i < newSlots.length && fn !== '?') newSlots[i] = fn;
        }
      });
      let swap = 'Không';
      if ((main.config || '').includes('Đổi:')) {
        swap = ((main.config.match(/Đổi:(.+)/) || [])[1] || '').trim() || 'Không';
      }
      setMState(s => ({ ...s, qty: main.qty, slots: newSlots, swap }));
      setNote(main.note || '');
    } else {
      setMState(s => ({ ...s, qty: main.qty, cakeFlavor: main.flavor || '' }));
      const cfg = (main.config || '').split('|');
      const nt = (main.note || '').split('|');
      setCakeWr(cfg[0]?.replace('Viết chữ:', '').trim() || 'Không');
      setCakeTxt(cfg[1]?.replace('Nội dung:', '').trim() || '');
      setCakeTheme(nt[0] || '');
      setCakeDetail(nt[1] || '');
      if (main.size) setCakeSz(main.size);
    }
  }, [editingId, productKey]);

  if (!open || !meta) return null;

  const jarTotal = Object.values(mState.jarQty).reduce((a, b) => a + b, 0);
  const showGift = meta.type === 'jar' && jarTotal >= 5;
  const showGift2 = meta.type === 'jar' && jarTotal >= 10;

  const modalTotal = () => {
    if (meta.type === 'jar') return jarTotal * meta.price;
    if (meta.type === 'set') return (mState.qty || 0) * meta.price;
    return 0;
  };

  const chJar = (key, d) => {
    setMState(s => ({ ...s, jarQty: { ...s.jarQty, [key]: Math.max(0, (s.jarQty[key] || 0) + d) } }));
  };

  const chSet = (d) => {
    setMState(s => ({ ...s, qty: Math.max(0, (s.qty || 0) + d) }));
  };

  const setSlot = (idx, flavor) => {
    setMState(s => {
      const slots = [...s.slots];
      slots[idx] = flavor;
      return { ...s, slots };
    });
    setSubModal({ open: false, slotIdx: -1, title: '' });
  };

  const clearSlot = (idx, e) => {
    e.stopPropagation();
    setMState(s => {
      const slots = [...s.slots];
      slots[idx] = null;
      return { ...s, slots };
    });
  };

  const handleAdd = () => {
    const isEdit = !!editingId;
    const groupId = isEdit ? editingId : genId();
    const newItems = [];

    if (meta.type === 'jar') {
      let added = 0;
      FLAVORS.forEach(f => {
        const qty = mState.jarQty[f.key] || 0;
        if (qty > 0) {
          newItems.push({ id: genId(), editGroup: groupId, pKey: productKey, name: meta.name, size: meta.size, flavor: f.name, qty, unitPrice: meta.price, lineTotal: qty * meta.price, type: 'jar', config: '', note });
          added++;
        }
      });
      if (!added) { alert('Vui lòng chọn ít nhất 1 hũ!'); return; }
      if (jarTotal >= 5 && gift1 && gift1 !== 'none')
        newItems.push({ id: genId(), editGroup: groupId, pKey: 'gift', name: 'Quà tặng hũ lẻ', size: meta.size, flavor: gift1, qty: 1, unitPrice: 0, lineTotal: 0, type: 'gift', config: '', note: '' });
      if (jarTotal >= 10 && gift2 && gift2 !== 'none')
        newItems.push({ id: genId(), editGroup: groupId, pKey: 'gift', name: 'Quà tặng hũ lẻ', size: meta.size, flavor: gift2, qty: 1, unitPrice: 0, lineTotal: 0, type: 'gift', config: '', note: '' });
    } else if (meta.type === 'set') {
      const qty = mState.qty || 0;
      if (!qty) { alert('Vui lòng chọn số lượng!'); return; }
      const sc = mState.slots.map((s, i) => s ? `Ô${i + 1}:${s}` : `Ô${i + 1}:?`).join(' | ');
      const config = mState.swap && mState.swap !== 'Không' ? `${sc} | Đổi:${mState.swap}` : sc;
      newItems.push({ id: groupId, editGroup: groupId, pKey: productKey, name: meta.name, size: '', flavor: '', qty, unitPrice: meta.price, lineTotal: qty * meta.price, type: 'set', config, note });
    } else {
      const qty = mState.qty || 0;
      if (!qty) { alert('Vui lòng chọn số lượng!'); return; }
      newItems.push({ id: groupId, editGroup: groupId, pKey: 'cake', name: meta.name, size: cakeSz, flavor: mState.cakeFlavor, qty, unitPrice: 0, lineTotal: 0, type: 'cake_quote', config: `Viết chữ:${cakeWr}|Nội dung:${cakeTxt}`, note: `${cakeTheme}|${cakeDetail}` });
    }

    onConfirm(newItems, groupId, isEdit);
    onClose();
  };

  return (
    <>
      <div className="moverlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal">
          <button className="modal-close" onClick={onClose}>×</button>

          {editingId && (
            <div className="edit-banner show">
              ✏️ <span>Đang sửa món — chỉnh xong bấm "Cập nhật đơn" nhé !</span>
            </div>
          )}

          <div className="m-hdr">
            <div className="m-pname">{meta.name}</div>
            <div className="m-pprice">{meta.price > 0 ? money(meta.price) : 'Báo giá'}</div>
            <div className="m-pdesc">{meta.desc}</div>
          </div>

          <div className="m-body">
            {/* JAR */}
            {meta.type === 'jar' && (
              <>
                <div className="gift-banner">🎁 Mua 5 hũ cùng size tặng 1 · Mua 10 hũ tặng 2</div>
                <div className="mst">Chọn vị &amp; số lượng</div>
                <div className="flavor-grid">
                  {FLAVORS.map(f => (
                    <div
                      key={f.key}
                      className="ftile"
                      style={{ background: mState.jarQty[f.key] > 0 ? f.color : undefined }}
                    >
                      <FlavorIcon f={f} sz={58} />
                      <div className="fname">{f.name}</div>
                      <div className="fqty">
                        <button type="button" className="fqty-btn" onClick={() => chJar(f.key, -1)}>−</button>
                        <span className="fqty-disp">{mState.jarQty[f.key] || 0}</span>
                        <button type="button" className="fqty-btn" onClick={() => chJar(f.key, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {showGift && (
                  <div style={{ paddingTop: 12, borderTop: '1px dashed var(--line)', marginTop: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown)', marginBottom: 8 }}>🎁 Chọn vị quà tặng:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--brown2)', display: 'block', marginBottom: 4 }}>Quà 1</label>
                        <select className="m-sel" value={gift1} onChange={e => setGift1(e.target.value)}>
                          <option value="none">Không chọn</option>
                          {FLAVORS.map(f => <option key={f.key} value={f.name}>{f.name}</option>)}
                        </select>
                      </div>
                      {showGift2 && (
                        <div>
                          <label style={{ fontSize: 12, color: 'var(--brown2)', display: 'block', marginBottom: 4 }}>Quà 2</label>
                          <select className="m-sel" value={gift2} onChange={e => setGift2(e.target.value)}>
                            <option value="none">Không chọn</option>
                            {FLAVORS.map(f => <option key={f.key} value={f.name}>{f.name}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mst" style={{ marginTop: 16 }}>Ghi chú</div>
                <textarea className="m-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú cho nhóm hũ này..." />
              </>
            )}

            {/* SET */}
            {meta.type === 'set' && (
              <>
                <div className="mst">Số lượng set</div>
                <div className="mq-row">
                  <label>Số lượng</label>
                  <button type="button" className="mq-btn" onClick={() => chSet(-1)}>−</button>
                  <span className="mq-disp">{mState.qty}</span>
                  <button type="button" className="mq-btn" onClick={() => chSet(1)}>+</button>
                </div>

                {meta.hasSwap && (
                  <>
                    <div className="mst">Tuỳ chọn hộp</div>
                    <select className="m-sel" value={mState.swap} onChange={e => setMState(s => ({ ...s, swap: e.target.value }))}>
                      <option value="Không">Không đổi 2 hũ tròn+2 hũ trái tim</option>
                      <option value="Có">Có đổi 2 hũ tròn+2 hũ trái tim</option>
                    </select>
                  </>
                )}

                <div className="mst" style={{ marginTop: 14 }}>
                  Chọn vị cho từng ô <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--brown2)' }}>(set 1)</span>
                </div>
                <div className="slot-hint">Bấm vào ô để chọn vị. Mua nhiều set → ghi vị set 2, 3... vào ghi chú !</div>
                <div className={`slot-grid s${meta.slots}`}>
                  {mState.slots.map((fl, i) => (
                    <div
                      key={i}
                      className={`slot-item${fl ? ' filled' : ''}`}
                      onClick={() => setSubModal({ open: true, slotIdx: i, title: `Chọn vị cho ô ${i + 1}` })}
                    >
                      <div className="slot-num">Ô {i + 1}</div>
                      {fl ? (() => {
                        const f = FLAVORS.find(x => x.name === fl) || { emoji: '?', color: '#eee', name: fl };
                        return (
                          <>
                            <div className="slot-fimg" style={{ background: f.color }}>
                              <span style={{ fontSize: 20 }}>{f.emoji}</span>
                            </div>
                            <div className="slot-label">{f.name}</div>
                            <button type="button" className="slot-x" onClick={e => clearSlot(i, e)}>×</button>
                          </>
                        );
                      })() : (
                        <>
                          <div className="slot-add">+</div>
                          <div className="slot-add-txt">Chọn vị</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mst">Ghi chú / vị cho set 2, 3...</div>
                <textarea className="m-note" value={note} onChange={e => setNote(e.target.value)} placeholder="VD: Set 2: chanh dây + kiwi..." />
              </>
            )}

            {/* CAKE */}
            {meta.type === 'cake' && (
              <>
                <div className="mst">Số lượng bánh</div>
                <div className="mq-row">
                  <label>Số lượng</label>
                  <button type="button" className="mq-btn" onClick={() => chSet(-1)}>−</button>
                  <span className="mq-disp">{mState.qty}</span>
                  <button type="button" className="mq-btn" onClick={() => chSet(1)}>+</button>
                </div>

                <div className="mst">Vị chính</div>
                <div className="cake-fg">
                  {FLAVORS.map(f => (
                    <div
                      key={f.key}
                      className={`cfi${mState.cakeFlavor === f.name ? ' selected' : ''}`}
                      onClick={() => setMState(s => ({ ...s, cakeFlavor: f.name }))}
                    >
                      <div className="cfi-check">✓</div>
                      <FlavorIcon f={f} sz={52} />
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--brown)', textAlign: 'center', marginTop: 2 }}>{f.name}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, marginBottom: 10 }}>
                  <div>
                    <div className="mst">Size bánh</div>
                    <select className="m-sel" value={cakeSz} onChange={e => setCakeSz(e.target.value)}>
                      <option value="">Chọn size</option>
                      <option value="14cm">14cm</option>
                      <option value="22cm">22cm</option>
                    </select>
                  </div>
                  <div>
                    <div className="mst">Viết chữ?</div>
                    <select className="m-sel" value={cakeWr} onChange={e => setCakeWr(e.target.value)}>
                      <option value="Không">Không viết chữ</option>
                      <option value="Có">Có viết chữ</option>
                    </select>
                  </div>
                </div>

                <div className="mst">Nội dung chữ (nếu có)</div>
                <input className="m-inp" value={cakeTxt} onChange={e => setCakeTxt(e.target.value)} placeholder="VD: Happy Birthday Mẹ" style={{ marginBottom: 10 }} />
                <div className="mst">Concept / màu sắc / decor</div>
                <textarea className="m-note" value={cakeTheme} onChange={e => setCakeTheme(e.target.value)} placeholder="Mô tả concept mong muốn..." style={{ marginBottom: 10 }} />
                <div className="mst">Chi tiết từng bánh (nếu đặt ≥2)</div>
                <textarea className="m-note" value={cakeDetail} onChange={e => setCakeDetail(e.target.value)} placeholder="VD: Bánh 1 - 14cm chanh dây..." />
              </>
            )}
          </div>

          <div className="m-footer">
            <div>
              <div className="mt-lbl">Tổng món này</div>
              <div className="mt-num">{money(modalTotal())}</div>
            </div>
            <button
              className={`btn-add${editingId ? ' em' : ''}`}
              onClick={handleAdd}
            >
              {editingId ? '✅ Cập nhật đơn' : '🛒 Thêm vào giỏ'}
            </button>
          </div>
        </div>
      </div>

      <FlavorSubModal
        open={subModal.open}
        title={subModal.title}
        currentFlavor={mState.slots[subModal.slotIdx]}
        onSelect={f => setSlot(subModal.slotIdx, f)}
        onClose={() => setSubModal({ open: false, slotIdx: -1, title: '' })}
      />
    </>
  );
}
