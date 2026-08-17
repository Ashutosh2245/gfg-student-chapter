const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');

// GET /api/departments - List all 7 departments with member counts and lead info
router.get('/', async (req, res) => {
  try {
    const departments = dbInstance.departments.map(dept => {
      const deptMembers = dbInstance.users.filter(u => u.department_id === dept.id && u.is_active);
      const lead = deptMembers.find(u => u.role === 'LEAD');
      const coLeads = deptMembers.filter(u => u.role === 'CO_LEAD');

      const completedTasks = dbInstance.tasks.filter(t => t.department_id === dept.id && t.status === 'COMPLETED').length;
      const totalXP = dbInstance.xpTransactions
        .filter(x => {
          const u = dbInstance.users.find(usr => usr.id === x.user_id);
          return u && u.department_id === dept.id;
        })
        .reduce((sum, item) => sum + item.xp_amount, 0);

      return {
        ...dept,
        member_count: deptMembers.length,
        lead: lead ? { id: lead.id, name: lead.name, avatar_url: lead.avatar_url, position: lead.position } : null,
        co_leads: coLeads.map(c => ({ id: c.id, name: c.name, avatar_url: c.avatar_url, position: c.position })),
        completed_tasks: completedTasks,
        total_xp: totalXP
      };
    });

    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments.' });
  }
});

// GET /api/departments/:slug - Get single department details & operational data
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const dept = dbInstance.departments.find(d => d.slug === slug || String(d.id) === String(slug));

    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const members = dbInstance.users.filter(u => u.department_id === dept.id && u.is_active).map(u => {
      const { password_hash, ...pub } = u;
      return pub;
    });

    const tasks = dbInstance.tasks.filter(t => t.department_id === dept.id);

    res.json({
      success: true,
      department: dept,
      members,
      tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving department.' });
  }
});

module.exports = router;
