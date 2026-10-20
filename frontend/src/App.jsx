import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';


import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import StockIn from './pages/StockIn';
import StockOut from './pages/StockOut';
import LowStock from './pages/LowStock';
import ProductAdd from './pages/ProductAdd';
import ProductEdit from './pages/ProductEdit';
import Suppliers from './pages/Suppliers';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shop_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('shop_user', JSON.stringify(userData));
    localStorage.setItem('shop_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('shop_user');
    localStorage.removeItem('shop_token');
    setUser(null);
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          {}
          <Route
            path="/login"
            element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/products" replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/products" replace />}
          />

          {}
          <Route path="/" element={<Navigate to={user ? "/products" : "/login"} replace />} />

          {}
          <Route
            path="/products"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'staff']}>
                <Products user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'staff']}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock/in"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'staff']}>
                <StockIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock/out"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'staff']}>
                <StockOut />
              </ProtectedRoute>
            }
          />
          <Route
            path="/low-stock"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'staff']}>
                <LowStock />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <ProductAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <ProductEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/suppliers"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <Suppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
