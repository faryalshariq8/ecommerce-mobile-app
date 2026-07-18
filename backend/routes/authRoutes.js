const express = require('express');
const { registerUser, loginUser, updateUserProfile, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);

module.exports = router;
