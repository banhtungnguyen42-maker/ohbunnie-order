import { META } from '../data/products';
import { useEffect } from 'react';

function ProductCard({ pKey, meta, cartQty, onOpen }) {
  const priceText = meta.price > 0
    ? `${meta.price.toLocaleString('vi-VN')}đ${meta.type === 'jar' ? '/hũ' : meta.type === 'set' ? '/set' : '/box'}`
    : 'Báo giá';

  const btnLabel = meta.type === 'cake' ? 'Liên hệ đặt' : 'Chọn vị & đặt';

  return (
    <div className="pcard rev" onClick={() => onOpen(pKey)}>
      {cartQty > 0 && <span className="pcart-b show">{cartQty}</span>}
      <div className="pimg">
        {meta.image
          ? <img src={meta.image} alt={meta.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : meta.emoji}
      </div>
      <div className="pname">{meta.name}</div>
      <div className="pprice">{priceText}</div>
      <div className="pstars">★★★★★</div>
      <button className="pbtn" onClick={e => { e.stopPropagation(); onOpen(pKey); }}>{btnLabel}</button>
    </div>
  );
}

export default function ProductSection({ cart, onOpenModal, onOpenCart, onScrollToOrder }) {
  useEffect(() => {
    const els = document.querySelectorAll('#shop .rev');
    const ro = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const getCartQty = (pKey) =>
    cart.filter(i => i.pKey === pKey && i.type !== 'gift').reduce((s, i) => s + i.qty, 0);

  return (
    <section id="shop" className="sec" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
      <span className="sec-tag rev">Menu sản phẩm</span>
      <h2 className="sec-title rev d1">Chọn món yêu thích</h2>
      <p className="sec-sub rev d2" style={{ marginBottom: 32 }}>Bấm vào sản phẩm để xem chi tiết và thêm vào giỏ !</p>

      <div className="pbanner rev">
        <span>@ohbunnie.sop ✦ Panna Cotta</span>
      </div>

      <div className="psec-h rev">
        🍮 Hũ Panna Cotta <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--brown2)' }}>— Mua 5 tặng 1 · Mua 10 tặng 2</span>
      </div>
      <div className="product-grid">
        {['jar50', 'jar100', 'jar500'].map((k, i) => (
          <div key={k} className={`rev d${i + 1}`}>
            <ProductCard pKey={k} meta={META[k]} cartQty={getCartQty(k)} onOpen={onOpenModal} />
          </div>
        ))}
      </div>

      <div className="psec-h rev">🎉 Party / Set</div>
      <div className="product-grid">
        {['mini4', 'mini6', 'box4'].map((k, i) => (
          <div key={k} className={`rev d${i + 1}`}>
            <ProductCard pKey={k} meta={META[k]} cartQty={getCartQty(k)} onOpen={onOpenModal} />
          </div>
        ))}
      </div>

      <div className="psec-h rev">🎂 Bánh sinh nhật panna cotta</div>
      <div className="product-grid">
        <div className="rev d1">
          <ProductCard pKey="cake" meta={META.cake} cartQty={getCartQty('cake')} onOpen={onOpenModal} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 36 }} className="rev">
        <button className="btn-pk" onClick={onOpenCart}>Xem giỏ hàng 🛒</button>
        <button className="btn-ol" onClick={onScrollToOrder} style={{ marginLeft: 12 }}>Đặt hàng ↓</button>
      </div>
    </section>
  );
}
