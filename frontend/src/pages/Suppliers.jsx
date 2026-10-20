import React, { useState, useEffect } from 'react';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../api/supplierApi';
import Loading from '../components/Loading';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });

  const fetchSupplierList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierList();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (supplier) => {
    setIsEditing(true);
    setCurrentId(supplier._id);
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      city: supplier.city
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', phone: '', city: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isEditing) {
        await updateSupplier(currentId, formData);
        setMessage('Supplier updated successfully.');
      } else {
        await createSupplier(formData);
        setMessage('Supplier created successfully.');
      }

      handleCancelEdit();
      fetchSupplierList();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete supplier "${name}"?`);
    if (!confirmDelete) return;

    try {
      setError('');
      setMessage('');
      await deleteSupplier(id);
      setMessage(`Supplier "${name}" deleted.`);
      fetchSupplierList();
    } catch (err) {
      setError(err.message || 'Could not delete supplier');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers Management</h1>
          <p className="page-subtitle">Manage wholesale distributors and vendors (Admin Only)</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {}
      <div className="card" style={{ maxWidth: '650px', marginBottom: '28px' }}>
        <h3 style={{ marginBottom: '16px' }}>
          {isEditing ? 'Edit Supplier Details' : '+ Add New Supplier'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="supplierName">
              Supplier / Company Name *
            </label>
            <input
              id="supplierName"
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. National Beverage Distributors"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                className="form-control"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City / Location *
              </label>
              <input
                id="city"
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Mumbai, Delhi"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Supplier'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {}
      {loading ? (
        <Loading message="Loading suppliers..." />
      ) : suppliers.length === 0 ? (
        <div className="empty-state">
          <h3>No suppliers found</h3>
          <p>Add suppliers above to assign them during Stock In operations.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Phone</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s._id}>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>{s.phone}</td>
                  <td>{s.city}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditClick(s)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
