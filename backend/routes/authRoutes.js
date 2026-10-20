const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  createAdminUser
} = require('../controllers/authController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', authHandler, getProfile);


router.post('/admin/create-admin', authHandler, allowRoles('admin'), createAdminUser);

module.exports = router;
