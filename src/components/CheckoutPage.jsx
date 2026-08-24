import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const { user, updateUser } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const savedAddress = user?.deliveryAddress || {};
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    street: savedAddress.street || '245 Burger Lane',
    city: savedAddress.city || 'Austin',
    state: savedAddress.state || 'TX',
    postcode: savedAddress.postcode || '78701',
    phone: user?.phone || '(512) 555-0145',
    paymentMethod: 'stripe',
  });
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  const updateCheckoutDetails = (event) => {
    const { name, value } = event.target;
    setCheckoutDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const total = subtotal + 4.99;
      let paymentIntentId;

      if (checkoutDetails.paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          throw new Error('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to the client environment.');
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Enter your card details to continue.');
        }

        const { data: intentData } = await checkoutApi.createPaymentIntent({ amount: total });
        const paymentResult = await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        });

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }

        paymentIntentId = paymentResult.paymentIntent.id;
      }

      const { data } = await checkoutApi.placeOrder({
        items: cartItems.map(({ id, name, price, quantity, image }) => ({
          id,
          name,
          price,
          quantity,
          image,
        })),
        total,
        deliveryAddress: {
          street: checkoutDetails.street,
          city: checkoutDetails.city,
          state: checkoutDetails.state,
          postcode: checkoutDetails.postcode,
          phone: checkoutDetails.phone,
        },
        paymentMethod: checkoutDetails.paymentMethod,
        paymentIntentId,
      });

      updateUser(data.user);
      setOrderPlaced(true);
      clearCart();

      window.setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
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

              <Form id="checkout-form" className="row g-3" onSubmit={placeOrder}>
                <Form.Group className="col-md-12">
                  <Form.Label>Street address</Form.Label>
                  <Form.Control name="street" type="text" value={checkoutDetails.street} onChange={updateCheckoutDetails} required />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" type="text" value={checkoutDetails.city} onChange={updateCheckoutDetails} required />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control name="phone" type="tel" value={checkoutDetails.phone} onChange={updateCheckoutDetails} required />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>State</Form.Label>
                  <Form.Control name="state" type="text" value={checkoutDetails.state} onChange={updateCheckoutDetails} required />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control name="postcode" type="text" value={checkoutDetails.postcode} onChange={updateCheckoutDetails} required />
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

              <Form.Group className="mt-4">
                <Form.Label>Payment method</Form.Label>
                <Form.Select name="paymentMethod" value={checkoutDetails.paymentMethod} onChange={updateCheckoutDetails} form="checkout-form">
                  <option value="stripe">Credit or debit card (Stripe)</option>
                  <option value="cash">Cash on delivery</option>
                </Form.Select>
              </Form.Group>

              {checkoutDetails.paymentMethod === 'stripe' && (
                <div className="border rounded-3 p-3 mt-3">
                  <Form.Label>Card details</Form.Label>
                  <CardElement options={{ hidePostalCode: true }} />
                  {!stripePublishableKey && (
                    <p className="text-danger small mb-0 mt-2">Stripe is not configured yet.</p>
                  )}
                </div>
              )}

              <Button type="submit" form="checkout-form" variant="primary" className="w-100 rounded-pill py-2 mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Placing order...' : 'Place order'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
