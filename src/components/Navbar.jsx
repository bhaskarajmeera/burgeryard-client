import { Button, Nav, Navbar as BootstrapNavbar, NavLink as BootstrapNavLink } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/burger-yard-logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="Burger Yard home">
          <img src={logo} alt="Burger Yard logo" className="brand-logo" />
        </Link>

        <Nav className="main-nav" as="nav" aria-label="Main navigation">
          <BootstrapNavLink as={NavLink} to="/" end>
            Menu
          </BootstrapNavLink>
          <BootstrapNavLink as={NavLink} to="/cart">
            Cart
          </BootstrapNavLink>
          <BootstrapNavLink as={NavLink} to="/checkout">
            Checkout
          </BootstrapNavLink>
        </Nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-pill" aria-label="View cart">
            Cart <span>{itemCount}</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="welcome-text">Hi, {user.name.split(' ')[0]}</span>
              <Button type="button" className="nav-button" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/signin" className="nav-button secondary">
                Sign In
              </Link>
              <Link to="/signup" className="nav-button primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
