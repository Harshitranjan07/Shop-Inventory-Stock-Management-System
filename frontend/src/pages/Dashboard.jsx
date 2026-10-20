import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../api/dashboardApi';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <Loading message="Loading shop dashboard analytics..." />;

  if (error || !data) {
    return (
      <div className="card">
        <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>Dashboard Error</h3>
        <p style={{ color: 'var(--text-muted)' }}>{error || 'Could not load metrics'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Real-time business inventory overview, stock value, and today's sales
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/stock/in" className="btn btn-success btn-sm">
            + Stock In
          </Link>
          <Link to="/stock/out" className="btn btn-primary btn-sm">
            - Stock Out (Sale)
          </Link>
        </div>
      </div>

      {}
      <div className="metrics-grid">
        <div className="stat-card primary-card">
          <span className="stat-title">Total Products</span>
          <span className="stat-value">{data.totalProducts}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Active catalog items
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Total Stock Value</span>
          <span className="stat-value">₹{(data.totalStockValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across {data.totalStockUnits || 0} total units in inventory
          </span>
        </div>

        <div className="stat-card danger-card">
          <span className="stat-title">Low Stock Alerts</span>
          <span className="stat-value" style={{ color: data.lowStockCount > 0 ? 'var(--danger)' : 'var(--dark)' }}>
            {data.lowStockCount}
          </span>
          <Link to="/low-stock" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            {data.lowStockCount > 0 ? 'View affected items →' : 'All stocks adequate'}
          </Link>
        </div>

        <div className="stat-card success-card">
          <span className="stat-title">Today's Sales</span>
          <span className="stat-value">₹{(data.todaySales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {data.todayItemsSold || 0} unit(s) sold today
          </span>
        </div>

        <div className="stat-card success-card">
          <span className="stat-title">Today's Profit</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>
            +₹{(data.todayProfit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Gross margin (Selling - Cost)
          </span>
        </div>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>⚠️ Low Stock Items</h3>
            <Link to="/low-stock" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {(!data.lowStockAlerts || data.lowStockAlerts.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No items need restocking right now.
            </p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Current</th>
                    <th>Reorder</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStockAlerts.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                      </td>
                      <td>
                        <span className="badge badge-low-stock">
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td>{item.reorderLevel} {item.unit}</td>
                      <td>
                        <Link to="/stock/in" className="btn btn-success btn-sm">
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Stock Activity</h3>
            <Link to="/products" className="btn btn-secondary btn-sm">
              All Products
            </Link>
          </div>

          {(!data.recentMovements || data.recentMovements.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No recent movements recorded yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentMovements.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <span className={`badge ${m.movementType === 'IN' ? 'badge-in' : 'badge-out'}`}>
                          {m.movementType === 'IN' ? 'IN' : 'OUT'}
                        </span>
                      </td>
                      <td>
                        {m.product ? (
                          <Link to={`/products/${m.product._id}`} style={{ fontWeight: 600 }}>
                            {m.product.name}
                          </Link>
                        ) : (
                          'Unknown item'
                        )}
                      </td>
                      <td>
                        <strong>
                          {m.quantity} {m.product ? m.product.unit : ''}
                        </strong>
                      </td>
                      <td>{m.recordedBy ? m.recordedBy.name : 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
