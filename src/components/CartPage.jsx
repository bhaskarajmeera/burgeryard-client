import { Button, Card, Col, Container, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="mx-auto text-center py-5" style={{ maxWidth: '640px' }}>
          <h1 className="mb-3">Your cart is empty</h1>
          <p className="text-muted mb-4">Pick your favorite burgers and sides from the menu.</p>
          <Button as={Link} to="/" variant="primary" className="px-4 py-2 rounded-pill">
            Browse Menu
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4 align-items-start">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Your order</h1>
            <Button variant="outline-secondary" className="rounded-pill" onClick={clearCart}>
              Clear cart
            </Button>
          </div>

          <Stack gap={3}>
            {cartItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <Card.Body className="d-flex gap-3 align-items-center p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 18 }}
                  />

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h3 className="mb-1">{item.name}</h3>
                        <p className="text-muted mb-0">{item.category}</p>
                      </div>
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 gap-3 flex-wrap">
                      <div className="d-flex align-items-center gap-2 border rounded-pill px-2 py-1">
                        <Button
                          variant="link"
                          className="p-0 text-dark fs-4 lh-1"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </Button>
                        <span className="fw-semibold">{item.quantity}</span>
                        <Button
                          variant="link"
                          className="p-0 text-dark fs-4 lh-1"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        variant="link"
                        className="text-danger p-0 text-decoration-none"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Stack>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">Order summary</h2>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <strong>$4.99</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span>${(subtotal + 4.99).toFixed(2)}</span>
              </div>

              <Button as={Link} to="/checkout" variant="primary" className="w-100 rounded-pill py-2">
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
