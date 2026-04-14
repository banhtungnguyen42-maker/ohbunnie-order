export default function Hero({ onGoShop, onGoAbout }) {
  return (
    <section className="hero" style={{ padding: 0 }}>
      <div className="hero-left">
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
      <div className="hero-right">
        <img
          src="https://lh3.googleusercontent.com/lSZPlEtOEHn1G3gSf9tSTMNCTMQ2sL8JZ6isOZEsM9QUeW9q_lrC2edRA5kRBzybMKXvuEV_sb3XxjeiMOrelfByT9NFwUlM=rw-w1587"
          alt="Oh Bunnie"
          loading="lazy"
        />
        <div className="hero-badge hbadge">
          <strong>Oh Bunnie</strong>@ohbunnie.sop
        </div>
      </div>
    </section>
  );
}
