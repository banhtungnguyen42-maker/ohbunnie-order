import { useEffect } from 'react';
import Footer from './Footer';

const REVIEWS = [
  { text: '"Bánh ngon lắm, mua lần 2 rồi mà vẫn mê!"', author: 'Khách hàng A', date: 'Thêm tên thật sau', av: 'A' },
  { text: '"Mua làm quà, ai cũng khen ngon và đóng gói xinh!"', author: 'Khách hàng B', date: 'Thêm tên thật sau', av: 'B' },
  { text: '"Vị chanh dây chua ngọt hợp gu quá!"', author: 'Khách hàng C', date: 'Thêm tên thật sau', av: 'C' },
];

const GALLERY = [
  'https://lh3.googleusercontent.com/lSZPlEtOEHn1G3gSf9tSTMNCTMQ2sL8JZ6isOZEsM9QUeW9q_lrC2edRA5kRBzybMKXvuEV_sb3XxjeiMOrelfByT9NFwUlM=rw-w1587',
  'https://lh3.googleusercontent.com/Eac5kJpHhKieHe33Xz_-xKAxjTt-JhHy3PZK-kNtfXju1lJiToJgfuN4dEyOih6jNc4eUIT214uufPCUuk0D1bsaUjuA06C7tw=rw-w1587',
  'https://lh3.googleusercontent.com/upAQU2RfS1tLnXGcnQW-6eNBHC5rznhAAytBdHfTrdFsWjgueAwlZLwlr4khQhECKNFZFHWiItJr9=rw-w1587',
  'https://lh3.googleusercontent.com/Xu_4OCYNgw4sJN4ZwxechggGp1Sc41HoQGlwLHSIB_3Xm69CgKAo1FfWsHi0Tf3zn5uO76HcfzLCuLE6BqPAxw_HBV7qrKVhuQ=rw-w1587',
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
      <section className="sec" style={{ background: 'var(--pink3)' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="sec-tag">Khách hàng nói gì</span>
          <h2 className="sec-title">Cảm nhận thật từ khách hàng</h2>
        </div>
        <div className="fb-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className={`fb-card rev d${i + 1}`}>
              <div className="fb-stars">★★★★★</div>
              <p className="fb-text">{r.text}</p>
              <div className="fb-auth">
                <div className="fb-av">{r.av}</div>
                <div>
                  <div className="fb-name">{r.author}</div>
                  <div className="fb-date">{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <span className="sec-tag rev">Ảnh sản phẩm</span>
        <h2 className="sec-title rev d1">Một chút hình ảnh từ Oh Bunnie</h2>
        <div className="gallery-grid">
          {GALLERY.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn-pk" onClick={gotoOrder}>Đặt hàng ngay ✦</button>
        </div>
      </section>

      <Footer setPage={setPage} scrollToShop={scrollToShop} scrollToOrder={scrollToOrder} />
    </div>
  );
}
