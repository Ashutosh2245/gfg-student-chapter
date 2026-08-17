const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gfg_niet_super_secret_jwt_key_2026_production_ready';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Access token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
};

// Role Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Your role (${req.user.role}) lacks sufficient permissions for this action.` 
      });
    }

    next();
  };
};

// Enforce Strict Department Operational Data Isolation
const enforceDepartmentIsolation = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  // Top Executives have cross-department oversight
  if (['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'].includes(req.user.role)) {
    return next();
  }

  // Leads and Co-Leads are strictly scoped to their own department
  const targetDepartmentId = req.query.department_id || req.body.department_id || req.params.department_id;
  
  if (targetDepartmentId && String(targetDepartmentId) !== String(req.user.department_id)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied. Department operational data is strictly isolated to assigned team members.'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  enforceDepartmentIsolation,
  JWT_SECRET
};
