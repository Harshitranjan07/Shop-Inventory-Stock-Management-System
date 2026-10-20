const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductMovements
} = require('../controllers/productController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');


router.use(authHandler);


router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/movements', getProductMovements);


router.post('/', allowRoles('admin'), createProduct);
router.put('/:id', allowRoles('admin'), updateProduct);
router.delete('/:id', allowRoles('admin'), deleteProduct);

module.exports = router;
