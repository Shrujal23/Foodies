const userService = require('../services/userService');

async function getUserDashboard(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const stats = await userService.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
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