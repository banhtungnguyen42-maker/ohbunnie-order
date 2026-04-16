import ChromaKeyVideo from './ChromaKeyVideo';

export default function Hero({ onGoShop, onGoAbout }) {
  return (
    <section className="hero" style={{ padding: 0 }}>
      <div className="hero-left">
        {/* Logo lơ lửng xoay nhẹ */}
        <img src="/images/logo shop.jpg" alt="Oh Bunnie Logo" className="hero-floating-logo" />

        <span className="hero-tag hi1">Homemade · Handcrafted · HCMC</span>
        <h1 className="hi2">
          Panna Cotta<br /><em>thuần khiết</em><br />từ Oh Bunnie
        </h1>
        <p className="hero-sub hi3">
          Làm thủ công từ 2023 — không chất bảo quản, dịu dàng từ hình thức đến hương vị.
        </p>
        <div className="hero-btns hi4">
          <button className="btn-pk" onClick={onGoShop}>Xem menu &amp; chọn món</button>
          <button className="btn-ol" onClick={onGoAbout}>Về Oh Bunnie</button>
        </div>
      </div>

      {/* Bunny Mascot nhảy múa (Với công nghệ tự tách phông xanh) */}
      <div className="hero-right" style={{ position: 'relative' }}>
        <div className="bunny-stage" style={{ position: 'absolute', bottom: 0, right: 0, width: '150%', height: '140%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none', transform: 'translate(10%, 15%)' }}>
          <ChromaKeyVideo
            src="/images/mascot.mp4"
            className="bunny-mascot"
          />
        </div>
      </div>
    </section>
  );
}
