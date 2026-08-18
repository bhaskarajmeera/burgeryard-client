import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="cart-empty">
        <div className="container narrow">
          <h1>Your cart is empty</h1>
          <p>Pick your favorite burgers and sides from the menu.</p>
          <Link to="/" className="nav-button primary">
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page container">
      <div className="cart-layout">
        <div className="cart-items">
          <div className="section-heading">
            <h1>Your order</h1>
            <button type="button" onClick={clearCart} className="clear-cart">
              Clear cart
            </button>
          </div>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-details">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </div>
                <div className="cart-actions">
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                  <button type="button" className="remove-item" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-price">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
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
          <Link to="/checkout" className="nav-button primary full-width">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
