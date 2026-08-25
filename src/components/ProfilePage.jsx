import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({
    phone: user.phone || '',
    street: user.deliveryAddress?.street || '',
    city: user.deliveryAddress?.city || '',
    state: user.deliveryAddress?.state || '',
    postcode: user.deliveryAddress?.postcode || '',
    cardholderName: user.paymentCard?.cardholderName || '',
    brand: user.paymentCard?.brand || '',
    last4: user.paymentCard?.last4 || '',
    expiryMonth: user.paymentCard?.expiryMonth || '',
    expiryYear: user.paymentCard?.expiryYear || '',
  });
  const initials = user.name
    .split(' ')
    .map((namePart) => namePart[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: profileData } = await authApi.getProfile();
        updateUser(profileData.user);
        setProfileForm({
          phone: profileData.user.phone || '',
          street: profileData.user.deliveryAddress?.street || '',
          city: profileData.user.deliveryAddress?.city || '',
          state: profileData.user.deliveryAddress?.state || '',
          postcode: profileData.user.deliveryAddress?.postcode || '',
          cardholderName: profileData.user.paymentCard?.cardholderName || '',
          brand: profileData.user.paymentCard?.brand || '',
          last4: profileData.user.paymentCard?.last4 || '',
          expiryMonth: profileData.user.paymentCard?.expiryMonth || '',
          expiryYear: profileData.user.paymentCard?.expiryYear || '',
        });
      } catch (error) {
        setProfileError(error.response?.data?.message || 'Unable to load your profile details.');
      }

      try {
        const { data: ordersData } = await authApi.getOrders();
        setOrders(ordersData.orders || []);
      } catch (error) {
        setOrdersError(error.response?.data?.message || 'Unable to load your order history.');
      } finally {
        setOrdersLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfileForm = (event) => {
    const { name, value } = event.target;
    setProfileForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setProfileError('');

    try {
      const { data } = await authApi.updateProfile({
        phone: profileForm.phone,
        deliveryAddress: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          postcode: profileForm.postcode,
        },
        paymentCard: {
          cardholderName: profileForm.cardholderName,
          brand: profileForm.brand,
          last4: profileForm.last4,
          expiryMonth: profileForm.expiryMonth,
          expiryYear: profileForm.expiryYear,
        },
      });
      updateUser(data.user);
      setIsEditing(false);
      toast.success('Profile details saved.');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to save profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={7} xl={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                {/* <div
                  className="rounded-circle d-grid place-items-center bg-warning text-dark fw-bold fs-4"
                  style={{ width: 80, height: 80 }}
                  aria-hidden="true"
                >
                  {initials}
                </div> */}
                <div>
                  <p className="text-uppercase text-warning fw-bold mb-1" style={{ letterSpacing: '0.08em' }}>
                    Your account
                  </p>
                  <h1 className="h2 mb-0">{user.name}</h1>
                </div>
              </div>

              {!isEditing ? (
                <>
                  <div className="border-top pt-3">
                    <p className="text-muted mb-1">Email address</p>
                    <p className="fs-5 mb-0">{user.email}</p>
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <p className="text-muted mb-1">Phone number</p>
                    <p className="fs-5 mb-0">{user.phone || 'Not added yet'}</p>
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <p className="text-muted mb-1">Delivery address</p>
                    <p className="fs-5 mb-0">
                      {user.deliveryAddress?.street
                        ? `${user.deliveryAddress.street}, ${user.deliveryAddress.city}, ${user.deliveryAddress.state} ${user.deliveryAddress.postcode}`
                        : 'Not added yet'}
                    </p>
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <p className="text-muted mb-1">Payment card</p>
                    <p className="fs-5 mb-0">
                      {user.paymentCard?.last4
                        ? `${user.paymentCard.brand} ending in ${user.paymentCard.last4}`
                        : 'Not added yet'}
                    </p>
                  </div>

                  <Button type="button" variant="outline-dark" className="rounded-pill px-4 mt-4 me-2" onClick={() => setIsEditing(true)}>
                    Edit details
                  </Button>
                  <Button as={Link} to="/checkout" variant="primary" className="rounded-pill px-4 mt-4">
                    Start an order
                  </Button>
                </>
              ) : (
                <Form onSubmit={saveProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control name="phone" type="tel" value={profileForm.phone} onChange={updateProfileForm} required />
                  </Form.Group>

                  <Form.Label>Delivery address</Form.Label>
                  <Row className="g-3 mb-3">
                    <Col xs={12}>
                      <Form.Control name="street" placeholder="Street address" value={profileForm.street} onChange={updateProfileForm} required />
                    </Col>
                    <Col sm={6}>
                      <Form.Control name="city" placeholder="City" value={profileForm.city} onChange={updateProfileForm} required />
                    </Col>
                    <Col sm={3}>
                      <Form.Control name="state" placeholder="State" value={profileForm.state} onChange={updateProfileForm} required />
                    </Col>
                    <Col sm={3}>
                      <Form.Control name="postcode" placeholder="Postcode" value={profileForm.postcode} onChange={updateProfileForm} required />
                    </Col>
                  </Row>

                  <Form.Label>Payment card details</Form.Label>
                  <p className="small text-muted">For security, only the last four digits are saved. Never enter your CVV.</p>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Form.Control name="cardholderName" placeholder="Cardholder name" value={profileForm.cardholderName} onChange={updateProfileForm} />
                    </Col>
                    <Col sm={6}>
                      <Form.Control name="brand" placeholder="Card brand" value={profileForm.brand} onChange={updateProfileForm} />
                    </Col>
                    <Col sm={6}>
                      <Form.Control name="last4" inputMode="numeric" maxLength={4} placeholder="Last 4 digits" value={profileForm.last4} onChange={updateProfileForm} />
                    </Col>
                    <Col sm={6}>
                      <Form.Control name="expiryMonth" inputMode="numeric" maxLength={2} placeholder="Expiry month (MM)" value={profileForm.expiryMonth} onChange={updateProfileForm} />
                    </Col>
                    <Col sm={6}>
                      <Form.Control name="expiryYear" inputMode="numeric" maxLength={4} placeholder="Expiry year (YYYY)" value={profileForm.expiryYear} onChange={updateProfileForm} />
                    </Col>
                  </Row>

                  {profileError && <Alert variant="danger" className="mt-3 mb-0">{profileError}</Alert>}
                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" variant="primary" className="rounded-pill px-4" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save details'}
                    </Button>
                    <Button type="button" variant="outline-secondary" className="rounded-pill px-4" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-4">
              <h2 className="h4 mb-4">Order history</h2>

              {ordersLoading && <p className="text-muted mb-0">Loading your orders...</p>}
              {ordersError && <Alert variant="warning" className="mb-0">{ordersError}</Alert>}
              {!ordersLoading && !ordersError && orders.length === 0 && (
                <p className="text-muted mb-0">Your completed orders will appear here.</p>
              )}

              {!ordersLoading && !ordersError && orders.length > 0 && (
                <Stack gap={3}>
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                        <div>
                          <p className="fw-semibold mb-1">
                            Order placed {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-muted small mb-0">
                            {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                          </p>
                        </div>
                        <strong>${order.total.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        <Badge bg="light" text="dark">
                          Payment: {order.paymentMethod === 'card' ? 'Card' : 'Cash on delivery'}
                        </Badge>
                        <Badge bg={order.paymentStatus === 'paid' ? 'success' : 'warning'} text={order.paymentStatus === 'paid' ? undefined : 'dark'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </Stack>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
