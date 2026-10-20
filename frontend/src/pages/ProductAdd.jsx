import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../api/productApi';
import ProductForm from '../components/ProductForm';

const ProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'pcs',
    costPrice: '',
    sellingPrice: '',
    openingStock: '0',
    reorderLevel: '10'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProduct({
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        openingStock: Number(formData.openingStock) || 0,
        reorderLevel: Number(formData.reorderLevel) || 10
      });

      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Create a new item in your catalog (Admin Only)</p>
        </div>
        <Link to="/products" className="btn btn-secondary btn-sm">
          ← Cancel
        </Link>
      </div>

      <ProductForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={false}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ProductAdd;
