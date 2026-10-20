import React from 'react';


const ProductForm = ({
  formData,
  onChange,
  onSubmit,
  isEdit = false,
  loading = false,
  error = ''
}) => {
  return (
    <form onSubmit={onSubmit} className="card form-container">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="sku">
            SKU (Stock Keeping Unit) *
          </label>
          <input
            id="sku"
            type="text"
            name="sku"
            className="form-control"
            placeholder="e.g. BEV-COL-300"
            value={formData.sku}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="form-control"
            placeholder="e.g. Coca Cola Can 300ml"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category *
          </label>
          <input
            id="category"
            type="text"
            name="category"
            className="form-control"
            placeholder="e.g. Beverages, Snacks, Dairy"
            value={formData.category}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="unit">
            Unit *
          </label>
          <input
            id="unit"
            type="text"
            name="unit"
            className="form-control"
            placeholder="e.g. pcs, can, packet, kg, box"
            value={formData.unit}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="costPrice">
            Cost Price (Purchase Price ₹) *
          </label>
          <input
            id="costPrice"
            type="number"
            step="0.01"
            min="0"
            name="costPrice"
            className="form-control"
            placeholder="0.00"
            value={formData.costPrice}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sellingPrice">
            Selling Price (Retail Price ₹) *
          </label>
          <input
            id="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            name="sellingPrice"
            className="form-control"
            placeholder="0.00"
            value={formData.sellingPrice}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        {!isEdit && (
          <div className="form-group">
            <label className="form-label" htmlFor="openingStock">
              Opening Stock (Initial Quantity)
            </label>
            <input
              id="openingStock"
              type="number"
              min="0"
              name="openingStock"
              className="form-control"
              placeholder="0"
              value={formData.openingStock}
              onChange={onChange}
            />
            <span className="form-helper">Quantity in stock at inception.</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="reorderLevel">
            Reorder Level (Low Stock Threshold) *
          </label>
          <input
            id="reorderLevel"
            type="number"
            min="0"
            name="reorderLevel"
            className="form-control"
            placeholder="10"
            value={formData.reorderLevel}
            onChange={onChange}
            required
          />
          <span className="form-helper">Alert triggers when stock reaches or drops below this.</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
        {loading ? 'Saving Product...' : isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;
