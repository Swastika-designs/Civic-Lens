const express = require('express');
const router = express.Router();
const { getAdminIssues, getAdminIssue, updateAdminIssue, deleteAdminIssue, getUsers } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/issues', getAdminIssues);
router.get('/issues/:id', getAdminIssue);
router.put('/issues/:id', updateAdminIssue);
router.delete('/issues/:id', deleteAdminIssue);
router.get('/users', getUsers);

module.exports = router;
