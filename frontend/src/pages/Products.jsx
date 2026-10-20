import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/productApi';
import Loading from '../components/Loading';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  const fetchProductList = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts(search);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList(searchTerm);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProductList(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchProductList('');
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      setDeleteMsg('');
      setError('');
      await deleteProduct(id);
      setDeleteMsg(`Product "${name}" deleted successfully.`);
      fetchProductList(searchTerm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Inventory</h1>
          <p className="page-subtitle">View and manage all catalog items and real-time stock levels</p>
        </div>

        {user && user.role === 'admin' && (
          <Link to="/admin/products/new" className="btn btn-primary">
            + Add New Product
          </Link>
        )}
      </div>

      {deleteMsg && <div className="alert alert-success">{deleteMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, SKU or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          {searchTerm && (
            <button type="button" onClick={handleClearSearch} className="btn btn-secondary btn-sm">
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <Loading message="Loading product inventory..." />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>
            {searchTerm
              ? `No products match your search query "${searchTerm}".`
              : 'Inventory is empty. Start by adding your first product.'}
          </p>
          {user && user.role === 'admin' && !searchTerm && (
            <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Add Product
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                const isLow = item.currentStock <= item.reorderLevel;
                return (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.sku}</strong>
                    </td>
                    <td>
                      <Link to={`/products/${item._id}`} style={{ fontWeight: 600 }}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.category}</td>
                    <td>₹{item.costPrice.toFixed(2)}</td>
                    <td>₹{item.sellingPrice.toFixed(2)}</td>
                    <td>
                      <strong>
                        {item.currentStock} {item.unit}
                      </strong>
                    </td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-low-stock">
                          Low Stock (≤{item.reorderLevel})
                        </span>
                      ) : (
                        <span className="badge badge-in-stock">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/products/${item._id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                        {user && user.role === 'admin' && (
                          <>
                            <Link to={`/admin/products/${item._id}/edit`} className="btn btn-secondary btn-sm">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id, item.name)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
