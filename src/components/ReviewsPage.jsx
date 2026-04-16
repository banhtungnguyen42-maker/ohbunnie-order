import { useEffect } from 'react';
import Footer from './Footer';

const FEEDBACK_IMGS = [
  '/images/feedback-1.jpg',
  '/images/feedback-2.jpg',
  '/images/feedback-3.png',
  '/images/feedback-4.png',
  '/images/feedback-5.png',
  '/images/feedback-6.jpg',
  '/images/feedback-7.jpg',
  '/images/feedback-8.jpg',
];

export default function ReviewsPage({ setPage, gotoOrder }) {
  useEffect(() => {
    const els = document.querySelectorAll('#page-reviews .rev');
    const ro = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const scrollToShop = () => { setPage('main'); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 60); };
  const scrollToOrder = () => { setPage('main'); setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 60); };

  return (
    <div id="page-reviews" style={{ paddingTop: 64 }}>

      {/* ── Masonry Gallery ── */}
      <section className="sec" style={{ background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="sec-tag rev">Feedback thật từ khách hàng</span>
          <h2 className="sec-title rev d1">Ảnh & cảm nhận từ Oh Bunnie</h2>
          <p className="sec-sub rev d2" style={{ margin: '0 auto 8px', textAlign: 'center' }}>
            Mỗi hũ bánh là một niềm vui — cùng xem khách hàng nói gì nhé !
          </p>
        </div>

        <div className="masonry-grid">
          {FEEDBACK_IMGS.map((src, i) => (
            <div key={i} className="masonry-item rev">
              <img src={src} alt={`Feedback ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn-pk" onClick={gotoOrder}>Đặt hàng ngay ✦</button>
        </div>
      </section>

      <Footer setPage={setPage} scrollToShop={scrollToShop} scrollToOrder={scrollToOrder} />
    </div>
  );
}
