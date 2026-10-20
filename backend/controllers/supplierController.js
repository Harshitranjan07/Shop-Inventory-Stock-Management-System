const Supplier = require('../models/Supplier');
const StockMovement = require('../models/StockMovement');




const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};




const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
};




const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, city } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({ message: 'Please provide name, phone, and city' });
    }

    const supplier = await Supplier.create({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim()
    });

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier
    });
  } catch (error) {
    next(error);
  }
};




const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const { name, phone, city } = req.body;

    if (name) supplier.name = name.trim();
    if (phone) supplier.phone = phone.trim();
    if (city) supplier.city = city.trim();

    const updatedSupplier = await supplier.save();

    res.status(200).json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier
    });
  } catch (error) {
    next(error);
  }
};




const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const movementCount = await StockMovement.countDocuments({ supplier: supplier._id });
    if (movementCount > 0) {
      return res.status(400).json({
        message: `Cannot delete supplier '${supplier.name}' because they are referenced in ${movementCount} purchase record(s).`
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Supplier deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
