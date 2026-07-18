const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, toggleUserAdmin } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/admin')
  .put(protect, admin, toggleUserAdmin);

module.exports = router;
