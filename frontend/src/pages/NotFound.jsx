import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="card" style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '8px' }}>404</h1>
      <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/products" className="btn btn-primary">
        Back to Products Inventory
      </Link>
    </div>
  );
};

export default NotFound;
