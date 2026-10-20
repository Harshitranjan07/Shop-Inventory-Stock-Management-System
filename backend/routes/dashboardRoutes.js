const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/dashboardController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');


router.get('/', authHandler, allowRoles('admin'), getDashboardMetrics);

module.exports = router;
