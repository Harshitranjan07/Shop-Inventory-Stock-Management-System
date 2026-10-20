const mongoose = require('mongoose');


const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter supplier name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please enter city'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
