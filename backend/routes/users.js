const express = require('express');
const router = express.Router();
const { getUserDashboard, logActivity } = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, getUserDashboard);
router.post('/activity', isAuthenticated, logActivity);

module.exports = router;