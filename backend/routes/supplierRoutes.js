const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');


router.use(authHandler);


router.get('/', getSuppliers);
router.get('/:id', getSupplierById);


router.post('/', allowRoles('admin'), createSupplier);
router.put('/:id', allowRoles('admin'), updateSupplier);
router.delete('/:id', allowRoles('admin'), deleteSupplier);

module.exports = router;
