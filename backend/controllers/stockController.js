const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const StockMovement = require('../models/StockMovement');




const stockIn = async (req, res, next) => {
  try {
    const { productId, supplierId, quantity, costPrice } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let supplier = null;
    if (supplierId) {
      supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
    }

    const purchaseCost = costPrice !== undefined && costPrice !== '' ? Number(costPrice) : product.costPrice;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { currentStock: qty },
        ...(costPrice !== undefined && costPrice !== '' ? { costPrice: purchaseCost } : {})
      },
      { new: true }
    );

    const movement = await StockMovement.create({
      product: product._id,
      supplier: supplier ? supplier._id : null,
      movementType: 'IN',
      quantity: qty,
      costPrice: purchaseCost,
      recordedBy: req.user._id,
      date: new Date()
    });

    res.status(200).json({
      message: `Successfully stocked in ${qty} ${product.unit} of ${product.name}`,
      product: updatedProduct,
      movement
    });
  } catch (error) {
    next(error);
  }
};




const stockOut = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.currentStock < qty) {
      return res.status(400).json({
        message: `Insufficient stock! Requested: ${qty} ${product.unit}, Available: ${product.currentStock} ${product.unit}`
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, currentStock: { $gte: qty } },
      { $inc: { currentStock: -qty } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({
        message: 'Could not complete sale: Stock changed during the transaction. Please refresh and try again.'
      });
    }

    const profitPerUnit = (product.sellingPrice || 0) - (product.costPrice || 0);
    const totalProfit = profitPerUnit * qty;

    const movement = await StockMovement.create({
      product: product._id,
      movementType: 'OUT',
      quantity: qty,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      profit: totalProfit,
      recordedBy: req.user._id,
      date: new Date()
    });

    res.status(200).json({
      message: `Successfully recorded sale of ${qty} ${product.unit} of ${product.name}`,
      product: updatedProduct,
      movement
    });
  } catch (error) {
    next(error);
  }
};




const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    }).sort({ currentStock: 1 });

    res.status(200).json(lowStockProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stockIn,
  stockOut,
  getLowStockProducts
};
