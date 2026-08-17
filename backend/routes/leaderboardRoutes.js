const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/leaderboard - Universal & Department Leaderboard Engine
router.get('/', async (req, res) => {
  try {
    const { department_slug, timeframe, search } = req.query; // timeframe: 'all', 'monthly', 'weekly'

    let members = dbInstance.users.filter(u => u.is_active);

    // Filter by department if department_slug is specified and not 'all' / 'overall'
    if (department_slug && department_slug !== 'all' && department_slug !== 'overall') {
      const dept = dbInstance.departments.find(d => d.slug === department_slug);
      if (dept) {
        members = members.filter(u => u.department_id === dept.id);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      members = members.filter(u => u.name.toLowerCase().includes(q) || u.position.toLowerCase().includes(q));
    }

    // Filter XP transactions by timeframe
    let xpRecords = [...dbInstance.xpTransactions];
    const now = new Date();
    if (timeframe === 'weekly') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
      xpRecords = xpRecords.filter(x => new Date(x.created_at) >= oneWeekAgo);
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);
      xpRecords = xpRecords.filter(x => new Date(x.created_at) >= oneMonthAgo);
    }

    // Aggregate XP and completed tasks per member
    const leaderboardData = members.map(member => {
      const dept = dbInstance.departments.find(d => d.id === member.department_id);
      
      const memberXP = xpRecords
        .filter(x => x.user_id === member.id)
        .reduce((sum, item) => sum + item.xp_amount, 0);

      const completedCount = dbInstance.tasks
        .filter(t => t.assigned_to_user_id === member.id && t.status === 'COMPLETED').length;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        position: member.position,
        department_name: dept ? dept.name : 'Executive Leadership',
        department_slug: dept ? dept.slug : 'executive',
        avatar_url: member.avatar_url,
        total_xp: memberXP,
        completed_tasks: completedCount
      };
    });

    // Sort descending by total_xp, breaking ties by completed_tasks
    leaderboardData.sort((a, b) => b.total_xp - a.total_xp || b.completed_tasks - a.completed_tasks);

    // Assign rank positions
    const rankedList = leaderboardData.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    res.json({
      success: true,
      mode: department_slug || 'overall',
      timeframe: timeframe || 'all',
      total_members: rankedList.length,
      leaderboard: rankedList
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute leaderboard rankings.' });
  }
});

// POST /api/leaderboard/award-xp (President & VP ONLY)
router.post('/award-xp', authenticateToken, authorizeRoles('PRESIDENT', 'VICE_PRESIDENT'), async (req, res) => {
  try {
    const { user_id, xp_amount, reason } = req.body;

    if (!user_id || !xp_amount || !reason) {
      return res.status(400).json({ success: false, message: 'User ID, XP amount, and reason are required.' });
    }

    const user = dbInstance.users.find(u => u.id === parseInt(user_id));
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const xpRecord = {
      id: dbInstance.xpTransactions.length + 1,
      user_id: parseInt(user_id),
      task_id: null,
      xp_amount: parseInt(xp_amount),
      reason,
      awarded_by_user_id: req.user.id,
      created_at: new Date().toISOString()
    };

    dbInstance.xpTransactions.push(xpRecord);

    dbInstance.auditLogs.push({
      id: dbInstance.auditLogs.length + 1,
      actor_user_id: req.user.id,
      action: 'AWARD_MANUAL_XP',
      target_entity: 'USER',
      target_id: String(user_id),
      details: { xp_amount, reason },
      created_at: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Awarded ${xp_amount} XP to ${user.name}!`,
      xpRecord
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error awarding manual XP.' });
  }
});

module.exports = router;
