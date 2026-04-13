import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';

function PrivateRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/products" replace /> : <LoginPage />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="products" element={<ProductsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="/" element={<Navigate to={token ? '/products' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
