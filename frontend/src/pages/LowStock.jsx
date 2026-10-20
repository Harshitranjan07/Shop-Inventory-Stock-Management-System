import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLowStock } from '../api/stockApi';
import Loading from '../components/Loading';

const LowStock = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getLowStock();
      setLowStockProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch low stock items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Low Stock Alerts</h1>
          <p className="page-subtitle">
            Items that have reached or fallen below their reorder threshold
          </p>
        </div>
        <Link to="/stock/in" className="btn btn-success">
          + Restock Items Now
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loading message="Checking inventory levels..." />
      ) : lowStockProducts.length === 0 ? (
        <div className="card empty-state" style={{ borderColor: 'var(--success)', background: 'var(--success-light)' }}>
          <h3 style={{ color: '#065f46' }}>All Products Well Stocked! 🎉</h3>
          <p style={{ color: '#047857' }}>
            No products are currently at or below their reorder level.
          </p>
        </div>
      ) : (
        <>
          <div className="alert alert-warning">
            ⚠️ <strong>{lowStockProducts.length} product(s)</strong> require immediate restocking to prevent stockouts!
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Deficit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => {
                  const deficit = Math.max(0, p.reorderLevel - p.currentStock);
                  return (
                    <tr key={p._id}>
                      <td>
                        <strong>{p.sku}</strong>
                      </td>
                      <td>
                        <Link to={`/products/${p._id}`} style={{ fontWeight: 600 }}>
                          {p.name}
                        </Link>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <span className="badge badge-low-stock" style={{ fontSize: '0.85rem' }}>
                          {p.currentStock} {p.unit}
                        </span>
                      </td>
                      <td>
                        {p.reorderLevel} {p.unit}
                      </td>
                      <td>
                        <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
                          {deficit === 0 ? 'At Threshold' : `-${deficit} ${p.unit}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to="/stock/in" className="btn btn-success btn-sm">
                            Restock
                          </Link>
                          <Link to={`/products/${p._id}`} className="btn btn-secondary btn-sm">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LowStock;
