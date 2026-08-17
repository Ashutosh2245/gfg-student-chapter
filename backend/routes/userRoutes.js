const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query, dbInstance } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/users - List members
router.get('/', async (req, res) => {
  try {
    const { department_id, role, search } = req.query;
    let users = [...dbInstance.users];

    if (department_id) {
      users = users.filter(u => String(u.department_id) === String(department_id));
    }
    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.position.toLowerCase().includes(q));
    }

    const enriched = users.map(u => {
      const dept = dbInstance.departments.find(d => d.id === u.department_id);
      const { password_hash, ...publicUser } = u;
      return {
        ...publicUser,
        department_name: dept ? dept.name : 'Executive Board',
        department_slug: dept ? dept.slug : 'executive'
      };
    });

    res.json({ success: true, users: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch members.' });
  }
});

// PATCH /api/users/profile/update - Self-service Profile Update (Any logged in member)
router.patch('/profile/update', authenticateToken, async (req, res) => {
  try {
    const { name, bio, avatar_url, linkedin_url, instagram_url, newPassword } = req.body;

    const user = dbInstance.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (linkedin_url !== undefined) user.linkedin_url = linkedin_url;
    if (instagram_url !== undefined) user.instagram_url = instagram_url;

    if (newPassword && newPassword.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }

    user.updated_at = new Date().toISOString();

    const dept = dbInstance.departments.find(d => d.id === user.department_id);
    const { password_hash, ...updatedProfile } = user;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        ...updatedProfile,
        department_name: dept ? dept.name : 'Executive Board'
      }
    });

  } catch (err) {
    console.error('Self Profile Update Error:', err);
    res.status(500).json({ success: false, message: 'Error updating your profile.' });
  }
});

// GET /api/users/:id - Member Public Profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = dbInstance.users.find(u => String(u.id) === String(userId));

    if (!user) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }

    const dept = dbInstance.departments.find(d => d.id === user.department_id);
    const { password_hash, ...publicUser } = user;

    const userXP = dbInstance.xpTransactions
      .filter(x => String(x.user_id) === String(userId))
      .reduce((sum, item) => sum + item.xp_amount, 0);

    const completedTasksCount = dbInstance.tasks
      .filter(t => String(t.assigned_to_user_id) === String(userId) && t.status === 'COMPLETED').length;

    res.json({
      success: true,
      member: {
        ...publicUser,
        department_name: dept ? dept.name : 'Executive Leadership',
        department_slug: dept ? dept.slug : 'executive',
        total_xp: userXP,
        completed_tasks: completedTasksCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving member profile.' });
  }
});

// PUT /api/users/:id - President Full Admin Member Edit
router.put('/:id', authenticateToken, authorizeRoles('PRESIDENT'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, department_id, position, bio, avatar_url, linkedin_url, instagram_url, newPassword } = req.body;

    const user = dbInstance.users.find(u => String(u.id) === String(userId));
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (department_id !== undefined) user.department_id = department_id ? parseInt(department_id) : null;
    if (position) user.position = position;
    if (bio !== undefined) user.bio = bio;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (linkedin_url !== undefined) user.linkedin_url = linkedin_url;
    if (instagram_url !== undefined) user.instagram_url = instagram_url;

    if (newPassword && newPassword.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }

    user.updated_at = new Date().toISOString();

    dbInstance.auditLogs.push({
      id: dbInstance.auditLogs.length + 1,
      actor_user_id: req.user.id,
      action: 'ADMIN_UPDATE_MEMBER',
      target_entity: 'USER',
      target_id: String(userId),
      details: { name: user.name, role: user.role, position: user.position },
      created_at: new Date().toISOString()
    });

    const { password_hash, ...updatedUser } = user;

    res.json({
      success: true,
      message: `Member ${user.name} details updated successfully!`,
      user: updatedUser
    });

  } catch (err) {
    console.error('Admin Update Member Error:', err);
    res.status(500).json({ success: false, message: 'Error updating member account.' });
  }
});

// DELETE /api/users/:id - President Admin Delete Account
router.delete('/:id', authenticateToken, authorizeRoles('PRESIDENT'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(req.user.id) === String(userId)) {
      return res.status(400).json({ success: false, message: 'President account cannot be self-deleted.' });
    }

    const index = dbInstance.users.findIndex(u => String(u.id) === String(userId));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const deletedUser = dbInstance.users.splice(index, 1)[0];

    dbInstance.auditLogs.push({
      id: dbInstance.auditLogs.length + 1,
      actor_user_id: req.user.id,
      action: 'ADMIN_DELETE_MEMBER',
      target_entity: 'USER',
      target_id: String(userId),
      details: { email: deletedUser.email, name: deletedUser.name },
      created_at: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Member account for ${deletedUser.name} deleted permanently.`
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting member account.' });
  }
});

// PATCH /api/users/:id/status (President ONLY - Toggle Active/Deactive)
router.patch('/:id/status', authenticateToken, authorizeRoles('PRESIDENT'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { is_active } = req.body;

    const user = dbInstance.users.find(u => String(u.id) === String(userId));
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    user.is_active = is_active;
    res.json({ success: true, message: `User active status updated to ${is_active}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating user status.' });
  }
});

module.exports = router;
