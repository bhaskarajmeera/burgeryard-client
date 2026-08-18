import { useState } from 'react';
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
  const { login, signup } = useAuth();

  const isSignUp = mode === 'signup';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (isSignUp) {
      const result = signup(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate('/');
      return;
    }

    const result = login(formData);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/checkout');
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

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="nav-button primary full-width">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  );
}
