import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductMovements } from '../api/productApi';
import Loading from '../components/Loading';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [prodData, moveData] = await Promise.all([
          getProductById(id),
          getProductMovements(id)
        ]);
        setProduct(prodData);
        setMovements(moveData.movements || []);
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading message="Loading product information..." />;

  if (error || !product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          {error || 'The requested product ID does not exist.'}
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const isLow = product.currentStock <= product.reorderLevel;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{product.name}</h1>
          <p className="page-subtitle">SKU: {product.sku} | Category: {product.category}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/products" className="btn btn-secondary">
            ← Back
          </Link>
          <Link to="/stock/in" className="btn btn-success">
            + Restock (Stock In)
          </Link>
          <Link to="/stock/out" className="btn btn-primary">
            - Sell (Stock Out)
          </Link>
        </div>
      </div>

      {}
      <div className="metrics-grid">
        <div className="stat-card">
          <span className="stat-title">Current Stock</span>
          <span className="stat-value">
            {product.currentStock} {product.unit}
          </span>
          <div>
            {isLow ? (
              <span className="badge badge-low-stock">Low Stock Alert</span>
            ) : (
              <span className="badge badge-in-stock">Adequate Stock</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-title">Reorder Level</span>
          <span className="stat-value">
            {product.reorderLevel} {product.unit}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Threshold for restocking
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Cost Price</span>
          <span className="stat-value">₹{product.costPrice.toFixed(2)}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Purchase cost per unit
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Selling Price</span>
          <span className="stat-value">₹{product.sellingPrice.toFixed(2)}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
            Margin: ₹{(product.sellingPrice - product.costPrice).toFixed(2)} / unit
          </span>
        </div>
      </div>

      {}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Stock Movement History</h2>
        {movements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No stock movements recorded for this item yet.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Unit Cost / Sale Price</th>
                  <th>Profit</th>
                  <th>Supplier</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m._id}>
                    <td>{new Date(m.date || m.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${m.movementType === 'IN' ? 'badge-in' : 'badge-out'}`}>
                        {m.movementType === 'IN' ? '⬇ STOCK IN' : '⬆ SALE (OUT)'}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {m.quantity} {product.unit}
                      </strong>
                    </td>
                    <td>
                      {m.movementType === 'IN'
                        ? `Cost: ₹${(m.costPrice || 0).toFixed(2)}`
                        : `Sold: ₹${(m.sellingPrice || 0).toFixed(2)}`}
                    </td>
                    <td>
                      {m.movementType === 'OUT' ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                          +₹{(m.profit || 0).toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{m.supplier ? m.supplier.name : '-'}</td>
                    <td>
                      {m.recordedBy ? `${m.recordedBy.name} (${m.recordedBy.role})` : 'System'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
