import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { getSuppliers } from '../api/supplierApi';
import { stockIn } from '../api/stockApi';
import Loading from '../components/Loading';

const StockIn = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: '',
    costPrice: ''
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        const [prodList, supList] = await Promise.all([getProducts(), getSuppliers()]);
        setProducts(prodList);
        setSuppliers(supList);
      } catch (err) {
        setError(err.message || 'Failed to load products or suppliers');
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProd = products.find((p) => p._id === selectedId);
    setFormData({
      ...formData,
      productId: selectedId,
      costPrice: selectedProd ? selectedProd.costPrice : ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.productId) {
      setError('Please select a product');
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    setSubmitting(true);

    try {
      const res = await stockIn({
        productId: formData.productId,
        supplierId: formData.supplierId || null,
        quantity: Number(formData.quantity),
        costPrice: formData.costPrice !== '' ? Number(formData.costPrice) : undefined
      });

      setSuccess(res.message || 'Stock In successfully recorded!');
      setFormData({
        productId: '',
        supplierId: '',
        quantity: '',
        costPrice: ''
      });

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to record Stock In');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading inventory options..." />;

  const selectedProduct = products.find((p) => p._id === formData.productId);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock In (Purchase & Restock)</h1>
          <p className="page-subtitle">Increase inventory levels when new stock arrives from suppliers</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="productId">
              Select Product *
            </label>
            <select
              id="productId"
              name="productId"
              className="form-control"
              value={formData.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku}) — In Stock: {p.currentStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="supplierId">
              Supplier (Optional)
            </label>
            <select
              id="supplierId"
              name="supplierId"
              className="form-control"
              value={formData.supplierId}
              onChange={handleChange}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
            <span className="form-helper">Vendor supplying this batch of items.</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">
                Quantity to Add {selectedProduct ? `(${selectedProduct.unit})` : ''} *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                name="quantity"
                className="form-control"
                placeholder="e.g. 50"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="costPrice">
                Purchase Cost per Unit (₹)
              </label>
              <input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                name="costPrice"
                className="form-control"
                placeholder="e.g. 25.00"
                value={formData.costPrice}
                onChange={handleChange}
              />
              <span className="form-helper">Updates product cost price if changed.</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={submitting}
          >
            {submitting ? 'Recording Purchase...' : 'Confirm Stock In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockIn;
