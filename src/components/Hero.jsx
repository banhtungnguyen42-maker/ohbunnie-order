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

      {/* Bunny Mascot nhảy múa */}
      <div className="hero-right">
        <div className="bunny-stage" style={{ borderBottom: 'none', height: '420px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}>
          <video
            src="/images/mascot.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="bunny-mascot"
          />
        </div>
      </div>
    </section>
  );
}
