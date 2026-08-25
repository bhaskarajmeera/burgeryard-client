
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthPage } from './components/AuthPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { Footer } from './components/Footer';
import { MenuPage } from './components/MenuPage';
import { AdminMenuPage } from './components/AdminMenuPage';
import { Navbar } from './components/Navbar';
import { OAuthCallback } from './components/OAuthCallback';
import { ProfilePage } from './components/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="page-shell">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/signin" element={<AuthPage mode="signin" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/menu"
                  element={
                    <ProtectedRoute>
                      <AdminMenuPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={1800} hideProgressBar />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
