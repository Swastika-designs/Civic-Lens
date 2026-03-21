const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/upload');
const {
  register, login, adminLogin, getMe,
  updateProfile, changePassword, deleteAccount,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
