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

        <div className="footer-copy">© 2026 Burger Yard</div>
      </div>
    </footer>
  );
}
