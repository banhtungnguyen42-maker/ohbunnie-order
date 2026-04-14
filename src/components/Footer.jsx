export default function Footer({ setPage, scrollToShop, scrollToOrder }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">Oh Bunnie</div>
          <p>Tiệm bánh thủ công chuyên panna cotta và các món tráng miệng mát lạnh. Thành lập tháng 8/2023.</p>
          <a className="ig-link" href="https://www.instagram.com/ohbunnie.sop/" target="_blank" rel="noreferrer">📸 @ohbunnie.sop</a>
        </div>
        <div className="footer-col">
          <h4>Menu</h4>
          <ul>
            <li><button className="flink" onClick={scrollToShop}>Hũ Panna Cotta</button></li>
            <li><button className="flink" onClick={scrollToShop}>Party / Set</button></li>
            <li><button className="flink" onClick={scrollToOrder}>Đặt hàng</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <ul>
            <li>97 Võ Văn Tần, P6, Q3, HCMC</li>
            <li><a href="tel:0879342955">087-934-2955</a></li>
            <li><a href="mailto:ohbunnie1123@gmail.com">ohbunnie1123@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <span>© {year} Oh Bunnie · Handmade with love 🤍</span>
        <span>@ohbunnie.sop</span>
      </div>
    </footer>
  );
}
