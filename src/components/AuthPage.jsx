import { useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ mode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup, socialLogin } = useAuth();

  const isSignUp = mode === 'signup';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // Submit either the sign-in or account-creation form for the current mode.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const action = isSignUp ? signup : login;
    const result = await action(formData);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(isSignUp ? '/' : '/checkout');
  };

  // Redirect to the provider; the callback completes authentication later.
  const handleSocialAuth = async (provider) => {
    setError('');
    const result = await socialLogin(provider);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/');
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <p className="eyebrow dark">Welcome</p>
          <h1>{isSignUp ? 'Create your account' : 'Sign in to Burger Yard'}</h1>
          <p>
            {isSignUp
              ? 'Join the burger club and start stacking up favorites.'
              : 'Access your account and continue your delicious order.'}
          </p>
        </div>

        <Stack gap={2} className="social-auth-group">
          <Button variant="light" className="social-auth-button google" onClick={() => handleSocialAuth('google')}>
            Continue with Google
          </Button>
        </Stack>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <Form.Group>
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
            </Form.Group>
          )}

          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </Form.Group>

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" className="nav-button primary full-width">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </Form>
      </div>
    </section>
  );
}
