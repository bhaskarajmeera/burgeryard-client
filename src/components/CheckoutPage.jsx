import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  const placeOrder = () => {
    setOrderPlaced(true);
    clearCart();

    window.setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  if (orderPlaced) {
    return (
      <section className="checkout-page container narrow">
        <div className="status-box success">
          <h1>Order placed successfully!</h1>
          <p>Your food is on the way. Thanks for choosing Burger Yard.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page container">
      <div className="checkout-layout">
        <div className="checkout-card">
          <h1>Checkout</h1>

          <div className="customer-box">
            <p className="eyebrow dark">Delivering to</p>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <form className="checkout-form">
            <label>
              Street address
              <input type="text" defaultValue="245 Burger Lane" />
            </label>
            <label>
              City
              <input type="text" defaultValue="Austin" />
            </label>
            <label>
              Phone number
              <input type="text" defaultValue="(512) 555-0145" />
            </label>
          </form>
        </div>

        <aside className="checkout-summary">
          <h2>Payment summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <strong>{cartItems.reduce((total, item) => total + item.quantity, 0)}</strong>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>$4.99</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>${(subtotal + 4.99).toFixed(2)}</strong>
          </div>
          <button type="button" className="nav-button primary full-width" onClick={placeOrder}>
            Place order
          </button>
        </aside>
      </div>
    </section>
  );
}
