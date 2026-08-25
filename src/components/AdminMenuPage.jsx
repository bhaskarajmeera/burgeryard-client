import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { menuApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyItem = { name: '', category: '', price: '', description: '', image: '', available: true };

export function AdminMenuPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    menuApi.getAll().then(({ data }) => setItems(data.menuItems || [])).catch(() => setError('Unable to load menu items.'));
  }, [user]);

  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const request = { ...form, price: Number(form.price) };
      const { data } = editingId ? await menuApi.update(editingId, request) : await menuApi.create(request);
      setItems((current) => editingId ? current.map((item) => item._id === editingId ? data.menuItem : item) : [...current, data.menuItem]);
      setForm(emptyItem);
      setEditingId(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save menu item.');
    }
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, category: item.category, price: item.price, description: item.description, image: item.image || '', available: item.available });
  };

  const removeItem = async (id) => {
    try {
      await menuApi.remove(id);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch {
      setError('Unable to delete menu item.');
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Menu management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={5}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <h2 className="h4">{editingId ? 'Edit item' : 'Add item'}</h2>
            <Form onSubmit={saveItem}>
              {['name', 'category', 'price', 'image'].map((field) => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label>{field[0].toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control name={field} type={field === 'price' ? 'number' : 'text'} step={field === 'price' ? '0.01' : undefined} value={form[field]} onChange={updateForm} required={field !== 'image'} />
                </Form.Group>
              ))}
              <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" value={form.description} onChange={updateForm} required /></Form.Group>
              <Form.Check className="mb-3" name="available" label="Available" checked={form.available} onChange={updateForm} />
              <Button type="submit" variant="primary" className="rounded-pill">{editingId ? 'Update item' : 'Add item'}</Button>
              {editingId && <Button type="button" variant="link" onClick={() => { setEditingId(null); setForm(emptyItem); }}>Cancel</Button>}
            </Form>
          </Card.Body></Card>
        </Col>
        <Col lg={7}><Stack gap={3}>{items.map((item) => <Card key={item._id} className="border-0 shadow-sm"><Card.Body className="d-flex justify-content-between gap-3"><div><h3 className="h5 mb-1">{item.name}</h3><p className="text-muted mb-1">{item.category} · ${Number(item.price).toFixed(2)}</p><p className="mb-0">{item.description}</p></div><div className="d-flex gap-2"><Button size="sm" variant="outline-dark" onClick={() => editItem(item)}>Edit</Button><Button size="sm" variant="outline-danger" onClick={() => removeItem(item._id)}>Delete</Button></div></Card.Body></Card>)}</Stack></Col>
      </Row>
    </Container>
  );
}
