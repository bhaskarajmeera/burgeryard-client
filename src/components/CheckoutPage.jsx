import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkoutApi } from '../api/axios';
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

  const placeOrder = async () => {
    try {
      await checkoutApi.placeOrder({
        items: cartItems.map(({ id, name, price, quantity, image }) => ({
          id,
          name,
          price,
          quantity,
          image,
        })),
        total: subtotal + 4.99,
        deliveryAddress: {
          street: '245 Burger Lane',
          city: 'Austin',
          state: 'TX',
          postcode: '78701',
        },
      });

      setOrderPlaced(true);
      clearCart();

      window.setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to connect to server. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <Container className="py-5">
        <div className="mx-auto text-center rounded-4 bg-white shadow-sm p-5" style={{ maxWidth: '640px' }}>
          <h1 className="mb-3">Order placed successfully!</h1>
          <p className="text-muted mb-0">Your food is on the way. Thanks for choosing Burger Yard.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4 align-items-start">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="mb-4">Checkout</h1>

              <div className="bg-light rounded-4 p-3 mb-4">
                <p className="text-uppercase text-warning fw-bold mb-2" style={{ letterSpacing: '0.08em' }}>
                  Delivering to
                </p>
                <h3 className="mb-1">{user.name}</h3>
                <p className="text-muted mb-0">{user.email}</p>
              </div>

              <Form className="row g-3">
                <Form.Group className="col-md-12">
                  <Form.Label>Street address</Form.Label>
                  <Form.Control type="text" defaultValue="245 Burger Lane" />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" defaultValue="Austin" />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control type="text" defaultValue="(512) 555-0145" />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">Payment summary</h2>

              <Stack gap={2}>
                <div className="d-flex justify-content-between">
                  <span>Items</span>
                  <strong>{cartItems.reduce((total, item) => total + item.quantity, 0)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivery</span>
                  <strong>$4.99</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${(subtotal + 4.99).toFixed(2)}</span>
                </div>
              </Stack>

              <Button type="button" variant="primary" className="w-100 rounded-pill py-2 mt-4" onClick={placeOrder}>
                Place order
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
