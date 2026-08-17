const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/analytics - Chapter-wide performance & department metrics
router.get('/', authenticateToken, authorizeRoles('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'), (req, res) => {
  try {
    const totalMembers = dbInstance.users.length;
    const activeMembers = dbInstance.users.filter(u => u.is_active).length;
    const totalTasks = dbInstance.tasks.length;
    const completedTasks = dbInstance.tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = dbInstance.tasks.filter(t => ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW'].includes(t.status)).length;
    
    const totalXP = dbInstance.xpTransactions.reduce((acc, curr) => acc + curr.xp_amount, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Breakdown per department
    const departmentPerformance = dbInstance.departments.map(dept => {
      const deptTasks = dbInstance.tasks.filter(t => t.department_id === dept.id);
      const deptCompleted = deptTasks.filter(t => t.status === 'COMPLETED').length;
      const deptXP = dbInstance.xpTransactions
        .filter(x => {
          const u = dbInstance.users.find(usr => usr.id === x.user_id);
          return u && u.department_id === dept.id;
        })
        .reduce((sum, item) => sum + item.xp_amount, 0);

      return {
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        totalTasks: deptTasks.length,
        completedTasks: deptCompleted,
        completionRate: deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0,
        totalXP: deptXP
      };
    });

    res.json({
      success: true,
      metrics: {
        totalMembers,
        activeMembers,
        totalTasks,
        completedTasks,
        pendingTasks,
        totalXP,
        completionRate,
        departmentPerformance
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute analytics.' });
  }
});

module.exports = router;
