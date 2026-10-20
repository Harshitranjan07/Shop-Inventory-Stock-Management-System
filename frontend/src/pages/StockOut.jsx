import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { stockOut } from '../api/stockApi';
import Loading from '../components/Loading';

const StockOut = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const selectedProduct = products.find((p) => p._id === productId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!productId) {
      setError('Please select a product to sell/dispatch.');
      return;
    }

    const qtyNum = Number(quantity);
    if (!quantity || qtyNum <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    if (selectedProduct && qtyNum > selectedProduct.currentStock) {
      setError(
        `Insufficient stock! Only ${selectedProduct.currentStock} ${selectedProduct.unit} available in inventory.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await stockOut({
        productId,
        quantity: qtyNum
      });

      setSuccess(res.message || 'Sale recorded successfully!');
      setProductId('');
      setQuantity('');

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Stock Out failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading product list..." />;

  const estimatedTotal =
    selectedProduct && quantity && Number(quantity) > 0
      ? (Number(quantity) * selectedProduct.sellingPrice).toFixed(2)
      : '0.00';

  const estimatedProfit =
    selectedProduct && quantity && Number(quantity) > 0
      ? (
          Number(quantity) *
          (selectedProduct.sellingPrice - selectedProduct.costPrice)
        ).toFixed(2)
      : '0.00';

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Out (Record Sale)</h1>
          <p className="page-subtitle">Deduct stock for customer purchases or outbound dispatch</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="productSelect">
              Select Product *
            </label>
            <select
              id="productSelect"
              className="form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.currentStock <= 0}>
                  {p.name} ({p.sku}) — Available: {p.currentStock} {p.unit} (₹{p.sellingPrice})
                  {p.currentStock <= 0 ? ' [OUT OF STOCK]' : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '14px',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Available Stock:</span>
                <strong>
                  {selectedProduct.currentStock} {selectedProduct.unit}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selling Price:</span>
                <strong>₹{selectedProduct.sellingPrice.toFixed(2)} / {selectedProduct.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cost Price:</span>
                <span>₹{selectedProduct.costPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="qtyInput">
              Sale Quantity {selectedProduct ? `(${selectedProduct.unit})` : ''} *
            </label>
            <input
              id="qtyInput"
              type="number"
              min="1"
              max={selectedProduct ? selectedProduct.currentStock : undefined}
              className="form-control"
              placeholder="e.g. 5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {selectedProduct && quantity && Number(quantity) > 0 && (
            <div
              style={{
                background: 'var(--success-light)',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#065f46' }}>
                <span>Total Bill Amount:</span>
                <strong>₹{estimatedTotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#065f46', fontSize: '0.85rem' }}>
                <span>Estimated Sale Profit:</span>
                <span>+₹{estimatedProfit}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Processing Sale...' : 'Record Sale & Deduct Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockOut;
