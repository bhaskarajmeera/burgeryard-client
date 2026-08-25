import { useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { completeSocialLogin } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const user = searchParams.get('user');

  useEffect(() => {
    if (!token || !user) {
      navigate('/signin?oauth=failed', { replace: true });
      return;
    }

    try {
      completeSocialLogin(token, JSON.parse(user));
      navigate('/', { replace: true });
    } catch {
      navigate('/signin?oauth=failed', { replace: true });
    }
  }, [completeSocialLogin, navigate, token, user]);

  return (
    <Container className="py-5">
      <Alert variant="info">Completing sign-in...</Alert>
    </Container>
  );
}
