import { META } from '../data/products';
import { money } from '../utils';

export default function CartDrawer({ open, cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.lineTotal, 0);

  return (
    <>
      <div className={`cart-ov${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-hdr">
          <h3>🛒 Giỏ hàng</h3>
          <button className="cart-cls" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">Giỏ hàng trống.<br />Chọn món để bắt đầu nhé ! 🍮</div>
          ) : (
            cart.map(item => {
              const m = META[item.pKey];
              const emoji = m ? m.emoji : (item.type === 'gift' ? '🎁' : '📦');
              const det = [item.size, item.flavor, item.config].filter(Boolean).join(' · ');
              const pr = item.type === 'gift' ? 'Tặng' : (item.lineTotal ? money(item.lineTotal) : 'Báo giá');
              return (
                <div className="citem" key={item.id}>
                  <div className="ci-img">{emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ci-name">{item.name}</div>
                    {det && <div className="ci-det">{det}</div>}
                    <div className="ci-pr">x{item.qty} · {pr}</div>
                  </div>
                  <button className="ci-rm" onClick={() => onRemove(item.id)}>×</button>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-ftr">
          <div className="cart-tot">
            <span>Tổng cộng</span>
            <strong>{money(total)}</strong>
          </div>
          <button className="btn-checkout" onClick={onCheckout}>Tiến hành đặt hàng ✦</button>
        </div>
      </div>
    </>
  );
}
