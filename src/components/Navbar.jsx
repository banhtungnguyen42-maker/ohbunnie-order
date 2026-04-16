import { useEffect, useState } from 'react';

export default function Navbar({ page, setPage, cartCount, onOpenCart, onGotoOrder }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* Top nav */}
      <nav className={`topnav${scrolled ? ' scrolled' : ''}`} id="topNav">
        <button className="nav-logo" onClick={() => setPage('main')}>
          <img src="/images/logo shop.jpg" alt="Oh Bunnie Logo" className="nav-logo-img" />
          Oh Bunnie
        </button>
        <ul className="nav-links">
          <li><button className={`ntab${page === 'main' ? ' active' : ''}`} onClick={() => setPage('main')}>Menu &amp; Đặt hàng</button></li>
          <li><button className={`ntab${page === 'about' ? ' active' : ''}`} onClick={() => setPage('about')}>Về Oh Bunnie</button></li>
          <li><button className={`ntab${page === 'reviews' ? ' active' : ''}`} onClick={() => setPage('reviews')}>Feedback &amp; Gallery</button></li>
        </ul>
        <div className="nav-right">
          <button className="cart-btn" onClick={onOpenCart}>
            🛒 Giỏ hàng
            <span className="cart-count">{cartCount}</span>
          </button>
          <button className="nav-cta" onClick={onGotoOrder}>Đặt ngay ✦</button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="botnav">
        <div className="botnav-inner">
          <button className={`mntab${page === 'main' ? ' active' : ''}`} onClick={() => setPage('main')}>
            <span className="mn-icon">🏠</span>
            <span className="mn-lbl">Đặt hàng</span>
          </button>
          <button className={`mntab${page === 'about' ? ' active' : ''}`} onClick={() => setPage('about')}>
            <span className="mn-icon">🍮</span>
            <span className="mn-lbl">Về chúng mình</span>
          </button>
          <button className={`mntab${page === 'reviews' ? ' active' : ''}`} onClick={() => setPage('reviews')}>
            <span className="mn-icon">⭐</span>
            <span className="mn-lbl">Feedback</span>
          </button>
          <button className="mntab" onClick={onOpenCart}>
            <span className="mn-cw">
              <span className="mn-icon">🛒</span>
              <span className="mn-cc">{cartCount}</span>
            </span>
            <span className="mn-lbl">Giỏ hàng</span>
          </button>
        </div>
      </nav>

      {/* Float order button */}
      <button className="float-order" onClick={onGotoOrder}>✦ Đặt ngay</button>
    </>
  );
}
