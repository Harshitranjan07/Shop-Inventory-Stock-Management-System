import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/productApi';
import ProductForm from '../components/ProductForm';
import Loading from '../components/Loading';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'pcs',
    costPrice: '',
    sellingPrice: '',
    reorderLevel: '10'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const data = await getProductById(id);
        setFormData({
          sku: data.sku || '',
          name: data.name || '',
          category: data.category || '',
          unit: data.unit || 'pcs',
          costPrice: data.costPrice !== undefined ? data.costPrice : '',
          sellingPrice: data.sellingPrice !== undefined ? data.sellingPrice : '',
          reorderLevel: data.reorderLevel !== undefined ? data.reorderLevel : '10'
        });
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      await updateProduct(id, {
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        reorderLevel: Number(formData.reorderLevel)
      });

      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loading message="Loading product information for editing..." />;

  return (
    <div>
      <div className="page-header" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
        <div>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">Update details and pricing for {formData.name || 'product'}</p>
        </div>
        <Link to="/products" className="btn btn-secondary btn-sm">
          ← Cancel
        </Link>
      </div>

      <ProductForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={true}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ProductEdit;
