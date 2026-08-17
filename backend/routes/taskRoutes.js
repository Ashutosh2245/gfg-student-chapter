const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');
const { authenticateToken, authorizeRoles, enforceDepartmentIsolation } = require('../middleware/auth');

// GET /api/tasks - List tasks (filtered by department, assigned user, or status)
router.get('/', authenticateToken, enforceDepartmentIsolation, async (req, res) => {
  try {
    const { department_id, assigned_to_user_id, status } = req.query;
    let tasks = [...dbInstance.tasks];

    // Department isolation rule: Lead & Co-Lead can ONLY see their department's tasks
    if (['LEAD', 'CO_LEAD'].includes(req.user.role)) {
      tasks = tasks.filter(t => String(t.department_id) === String(req.user.department_id));
    } else if (department_id) {
      tasks = tasks.filter(t => String(t.department_id) === String(department_id));
    }

    // Co-Leads viewing their personal task view
    if (req.user.role === 'CO_LEAD' && req.query.my_tasks === 'true') {
      tasks = tasks.filter(t => String(t.assigned_to_user_id) === String(req.user.id));
    } else if (assigned_to_user_id) {
      tasks = tasks.filter(t => String(t.assigned_to_user_id) === String(assigned_to_user_id));
    }

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    // Enrich task objects with user & department details
    const enrichedTasks = tasks.map(task => {
      const dept = dbInstance.departments.find(d => d.id === task.department_id);
      const assignee = dbInstance.users.find(u => u.id === task.assigned_to_user_id);
      const creator = dbInstance.users.find(u => u.id === task.created_by_user_id);
      const submission = dbInstance.taskSubmissions.find(s => s.task_id === task.id);

      return {
        ...task,
        department_name: dept ? dept.name : 'General',
        assignee: assignee ? { id: assignee.id, name: assignee.name, email: assignee.email, avatar_url: assignee.avatar_url } : null,
        creator: creator ? { id: creator.id, name: creator.name } : null,
        latest_submission: submission || null
      };
    });

    res.json({ success: true, tasks: enrichedTasks });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
});

// POST /api/tasks - Create Task (President, VP, Coordinator, LEAD)
router.post('/', authenticateToken, authorizeRoles('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD'), async (req, res) => {
  try {
    const { title, description, department_id, assigned_to_user_id, priority, difficulty, xp_points, deadline } = req.body;

    if (!title || !description || !department_id) {
      return res.status(400).json({ success: false, message: 'Title, description, and department_id are required.' });
    }

    // Department isolation check for Team Leads
    if (req.user.role === 'LEAD' && String(department_id) !== String(req.user.department_id)) {
      return res.status(403).json({ success: false, message: 'Team Leads can only create tasks for their own department.' });
    }

    // Calculate default XP by difficulty if not provided
    let points = parseInt(xp_points);
    if (!points || isNaN(points)) {
      switch (difficulty) {
        case 'EASY': points = 5; break;
        case 'MEDIUM': points = 10; break;
        case 'HARD': points = 20; break;
        case 'MAJOR': points = 35; break;
        default: points = 10;
      }
    }

    const newTask = {
      id: dbInstance.tasks.length + 1,
      title,
      description,
      department_id: parseInt(department_id),
      assigned_to_user_id: assigned_to_user_id ? parseInt(assigned_to_user_id) : null,
      priority: priority || 'MEDIUM',
      difficulty: difficulty || 'MEDIUM',
      xp_points: points,
      deadline: deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'PENDING',
      created_by_user_id: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbInstance.tasks.push(newTask);

    // Audit log
    dbInstance.auditLogs.push({
      id: dbInstance.auditLogs.length + 1,
      actor_user_id: req.user.id,
      action: 'CREATE_TASK',
      target_entity: 'TASK',
      target_id: String(newTask.id),
      details: { title: newTask.title, department_id: newTask.department_id, xp: newTask.xp_points },
      created_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: 'Task created successfully!', task: newTask });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating task.' });
  }
});

// PATCH /api/tasks/:id/status - Update Task Lifecycle Status (e.g. IN_PROGRESS)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    const task = dbInstance.tasks.find(t => String(t.id) === String(taskId));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Co-Leads can update status of their assigned tasks
    if (req.user.role === 'CO_LEAD' && String(task.assigned_to_user_id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only update status of tasks assigned to you.' });
    }

    task.status = status;
    task.updated_at = new Date().toISOString();

    res.json({ success: true, message: `Task status updated to ${status}`, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating task status.' });
  }
});

// POST /api/tasks/:id/submit - Submit Task with Proof Link & Comments
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { comment, proof_url, proof_type } = req.body;

    const task = dbInstance.tasks.find(t => String(t.id) === String(taskId));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (!proof_url) {
      return res.status(400).json({ success: false, message: 'Proof link or artifact URL is required for task submission.' });
    }

    // Update task lifecycle state
    task.status = 'SUBMITTED';
    task.updated_at = new Date().toISOString();

    const submission = {
      id: dbInstance.taskSubmissions.length + 1,
      task_id: parseInt(taskId),
      submitted_by_user_id: req.user.id,
      comment: comment || '',
      proof_url,
      proof_type: proof_type || 'LINK',
      status: 'UNDER_REVIEW',
      reviewer_comment: null,
      reviewed_by_user_id: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };

    dbInstance.taskSubmissions.push(submission);

    res.status(201).json({
      success: true,
      message: 'Task submitted successfully! Placed under review queue.',
      submission,
      task
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting task.' });
  }
});

// POST /api/tasks/:id/review - Review Submission (APPROVE / REJECT / REVISION_REQUIRED + Award XP)
router.post('/:id/review', authenticateToken, authorizeRoles('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const { action, reviewer_comment } = req.body; // action: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED'

    const task = dbInstance.tasks.find(t => String(t.id) === String(taskId));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Rule: Co-Leads cannot award XP or approve tasks; Team Lead can review within their department
    if (req.user.role === 'LEAD' && String(task.department_id) !== String(req.user.department_id)) {
      return res.status(403).json({ success: false, message: 'Team Leads can only review submissions within their department.' });
    }

    // Rule: A member cannot approve their own submission
    if (String(task.assigned_to_user_id) === String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Self-approval is forbidden. An authorized reviewer must approve.' });
    }

    const submission = dbInstance.taskSubmissions.find(s => s.task_id === parseInt(taskId));
    if (submission) {
      submission.status = action;
      submission.reviewer_comment = reviewer_comment || '';
      submission.reviewed_by_user_id = req.user.id;
      submission.reviewed_at = new Date().toISOString();
    }

    if (action === 'APPROVED') {
      task.status = 'COMPLETED';

      // Check if XP already awarded to prevent duplicate XP
      const alreadyAwarded = dbInstance.xpTransactions.some(x => x.task_id === parseInt(taskId) && x.user_id === task.assigned_to_user_id);
      if (!alreadyAwarded && task.assigned_to_user_id) {
        const xpRecord = {
          id: dbInstance.xpTransactions.length + 1,
          user_id: task.assigned_to_user_id,
          task_id: parseInt(taskId),
          xp_amount: task.xp_points,
          reason: `Task Approved: ${task.title}`,
          awarded_by_user_id: req.user.id,
          created_at: new Date().toISOString()
        };
        dbInstance.xpTransactions.push(xpRecord);
      }
    } else if (action === 'REJECTED') {
      task.status = 'REJECTED';
    } else if (action === 'REVISION_REQUIRED') {
      task.status = 'REVISION_REQUIRED';
    }

    task.updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: `Task review submitted as ${action}.`,
      task
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error processing task review.' });
  }
});

module.exports = router;
