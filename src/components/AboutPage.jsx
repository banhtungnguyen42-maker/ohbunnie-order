import { useEffect } from 'react';
import Footer from './Footer';

export default function AboutPage({ setPage, gotoOrder }) {
  useEffect(() => {
    const els = document.querySelectorAll('#page-about .rev');
    const ro = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const scrollToShop = () => { setPage('main'); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 60); };
  const scrollToOrder = () => { setPage('main'); setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 60); };

  return (
    <div id="page-about" style={{ paddingTop: 64 }}>
      <div className="about-hero">
        <span className="sec-tag">Về chúng mình</span>
        <h1 className="sec-title" style={{ margin: '8px auto', maxWidth: 600, textAlign: 'center' }}>
          Xin chào, mình là <em style={{ color: 'var(--pink)', fontStyle: 'italic' }}>Bunnie</em>
        </h1>
      </div>

      <section className="sec" style={{ background: 'var(--cream)' }}>
        <div className="about-grid">
          <div className="about-imgs rev fl">
            {/* Ảnh dọc chiếm cả 2 hàng bên trái */}
            <img className="about-img-tall" src="/images/me-banh-moi.jpg" alt="Oh Bunnie làm bánh" loading="lazy" />
            {/* Ảnh vuông bên phải */}
            <img className="about-img-sq" src="/images/mini6.jpg" alt="Khay 6 hũ panna cotta" loading="lazy" />
          </div>
          <div className="about-text rev fr">
            <div>
              <span className="sec-tag">Câu chuyện</span>
              <h2 className="sec-title">Bắt đầu từ<br />tình yêu bánh thủ công</h2>
            </div>
            <p>Thành lập vào tháng 8/2023, Oh Bunnie là tiệm bánh thủ công chuyên về panna cotta và các món tráng miệng mát lạnh, ít ngọt.</p>
            <p>Mỗi hũ bánh đều được chuẩn bị tỉ mỉ — không chỉ để thưởng thức mà còn để tự tin làm quà tặng. Chất lượng hiện diện trong từng sản phẩm.</p>
            <div className="stats">
              <div className="stat"><div className="stat-num">2023</div><div className="stat-lbl">Năm thành lập</div></div>
              <div className="stat"><div className="stat-num">7+</div><div className="stat-lbl">Hương vị</div></div>
              <div className="stat"><div className="stat-num">0</div><div className="stat-lbl">Chất bảo quản</div></div>
            </div>
            <button className="btn-pk" onClick={gotoOrder} style={{ width: 'fit-content' }}>Đặt hàng ngay ✦</button>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="sec-tag rev">Lý do chọn Oh Bunnie</span>
          <h2 className="sec-title rev d1">Tại sao khách hàng tin tưởng?</h2>
        </div>
        <div className="why-grid">
          <div className="why-card rev d1"><div className="why-icon">🌿</div><h3>Nguyên liệu chất lượng</h3><p>Sữa chọn lọc kỹ càng, tươi mới, an toàn. Không chất bảo quản.</p></div>
          <div className="why-card rev d2"><div className="why-icon">✨</div><h3>Hương vị đặc trưng</h3><p>Kết cấu dẻo mịn, nhẹ nhàng tan ra, không quá ngọt. Phù hợp gu hiện đại.</p></div>
          <div className="why-card rev d3"><div className="why-icon">🎁</div><h3>Trải nghiệm ưu ái</h3><p>Đóng gói xinh xắn, giao tận tay, lời nhắn yêu thương.</p></div>
        </div>
      </section>

      <Footer setPage={setPage} scrollToShop={scrollToShop} scrollToOrder={scrollToOrder} />
    </div>
  );
}
