const userService = require('../services/userService');

async function getUserDashboard(req, res) {
  try {
    if (!req.user?.id) {
      // Return safe empty defaults for unauthenticated users
      return res.json({
        success: true,
        isAuthenticated: false,
        role: 'user', // Default fallback role
        message: "Please log in to view your dashboard"
      });
    }

    const stats = await userService.getUserStats(req.user.id);

    return res.json({
      success: true,
      isAuthenticated: true,
      role: req.user.role || 'user', // Explicitly expose user role (e.g., 'admin' or 'user')
      ...stats
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    // Always return safe defaults on error to prevent frontend UI crashes
    return res.json({
      success: true,
      isAuthenticated: false,
      role: 'user',
      message: "Failed to load dashboard",
      totalFavorites: 0,
      recentFavorites: [],
      recentActivity: [],
      collections: [],
      topCategories: []
    });
  }
}

async function logActivity(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { activityType, recipeId, details } = req.body;
    await userService.logActivity(req.user.id, activityType, recipeId, details);
    res.json({ success: true });
  } catch (error) {
    console.error('Log Activity Error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
}

module.exports = {
  getUserDashboard,
  logActivity
};