const express = require('express');
const router = express.Router();
const {
  stockIn,
  stockOut,
  getLowStockProducts
} = require('../controllers/stockController');
const authHandler = require('../middleware/authHandler');


router.use(authHandler);

router.post('/in', stockIn);
router.post('/out', stockOut);
router.get('/low-stock', getLowStockProducts);

module.exports = router;
