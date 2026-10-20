const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');




const getProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [{ name: regex }, { sku: regex }, { category: regex }]
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};




const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};




const createProduct = async (req, res, next) => {
  try {
    const {
      sku,
      name,
      category,
      unit,
      costPrice,
      sellingPrice,
      openingStock,
      reorderLevel
    } = req.body;

    if (!sku || !name || !category || costPrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ message: 'Please provide all required product details' });
    }

    const existingSku = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existingSku) {
      return res.status(409).json({ message: 'A product with this SKU already exists' });
    }

    const initialStock = Number(openingStock) || 0;

    const product = await Product.create({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category: category.trim(),
      unit: unit ? unit.trim() : 'pcs',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      openingStock: initialStock,
      currentStock: initialStock,
      reorderLevel: reorderLevel !== undefined ? Number(reorderLevel) : 10
    });

    if (initialStock > 0) {
      await StockMovement.create({
        product: product._id,
        movementType: 'IN',
        quantity: initialStock,
        costPrice: Number(costPrice),
        recordedBy: req.user._id,
        date: new Date()
      });
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};




const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      sku,
      name,
      category,
      unit,
      costPrice,
      sellingPrice,
      reorderLevel
    } = req.body;

    if (sku && sku.trim().toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({
        sku: sku.trim().toUpperCase(),
        _id: { $ne: product._id }
      });
      if (existingSku) {
        return res.status(409).json({ message: 'A product with this SKU already exists' });
      }
      product.sku = sku.trim().toUpperCase();
    }

    if (name) product.name = name.trim();
    if (category) product.category = category.trim();
    if (unit) product.unit = unit.trim();
    if (costPrice !== undefined) product.costPrice = Number(costPrice);
    if (sellingPrice !== undefined) product.sellingPrice = Number(sellingPrice);
    if (reorderLevel !== undefined) product.reorderLevel = Number(reorderLevel);

    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};




const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.currentStock > 0) {
      return res.status(400).json({
        message: `Cannot delete product '${product.name}' because it currently has ${product.currentStock} units in stock. Please adjust stock first.`
      });
    }

    const movementCount = await StockMovement.countDocuments({ product: product._id });
    if (movementCount > 0) {
      return res.status(400).json({
        message: `Cannot delete product '${product.name}' because it has ${movementCount} recorded stock movements. To preserve audit history, this product cannot be removed.`
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Product deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};




const getProductMovements = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const movements = await StockMovement.find({ product: req.params.id })
      .populate('supplier', 'name phone city')
      .populate('recordedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      product,
      movements
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductMovements
};
