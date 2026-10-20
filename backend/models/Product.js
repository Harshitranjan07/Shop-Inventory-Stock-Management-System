const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'Please enter product SKU'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      trim: true
    },
    unit: {
      type: String,
      required: [true, 'Please enter unit (e.g. pcs, kg, box, packet)'],
      trim: true,
      default: 'pcs'
    },
    costPrice: {
      type: Number,
      required: [true, 'Please enter cost price'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please enter selling price'],
      min: [0, 'Selling price cannot be negative']
    },
    openingStock: {
      type: Number,
      default: 0,
      min: [0, 'Opening stock cannot be negative']
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, 'Current stock cannot be negative']
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Please enter reorder level'],
      default: 10,
      min: [0, 'Reorder level cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
