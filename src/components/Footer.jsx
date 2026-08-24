import logo from '../assets/burger-yard-logo.png';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="Burger Yard logo" className="footer-logo" />
          <span>Burger Yard</span>
        </div>

        <div className="footer-links">
          <a href="#">Menu</a>
          <a href="#">Offers</a>
          <a href="#">Locations</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-copy">
        <p>The Mark Hotel</p>
        <p>46 Dickson St, Lambton NSW 2299</p>
        <p> Mobile: +61 451 449 096</p>
        © 2026 Burger Yard</div>
      </div>
    </footer>
  );
}
