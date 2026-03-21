const Issue = require('../models/Issue');
const User = require('../models/User');

const DEPARTMENTS = [
  'Roads & Infrastructure',
  'Water & Sanitation',
  'Electricity',
  'Waste Management',
  'Public Safety',
  'Parks & Recreation',
  'General Administration',
];

// @desc    Get all issues for admin
// @route   GET /api/admin/issues
const getAdminIssues = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All Status') query.status = status;
    if (category && category !== 'All Types') query.category = category;
    if (priority && priority !== 'All Priority') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('reportedBy', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const allTotal = await Issue.countDocuments();
    const newReports = await Issue.countDocuments({ status: 'Reported' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });

    res.json({
      success: true, total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      summary: { allTotal, newReports, inProgress, resolved },
      issues,
      departments: DEPARTMENTS,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single issue for admin
// @route   GET /api/admin/issues/:id
const getAdminIssue = async (req, res) => {
  try {
    const issue = await Issue.findOne({
      $or: [
        { issueId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    }).populate('reportedBy', 'fullName email avatar phone');

    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, issue, departments: DEPARTMENTS });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update issue — status, priority, assignment, notes, official message
// @route   PUT /api/admin/issues/:id
const updateAdminIssue = async (req, res) => {
  try {
    const { status, priority, resolutionNotes, officialMessage, officialFrom, assignDepartment, assignOfficer } = req.body;

    const issue = await Issue.findOne({
      $or: [
        { issueId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    // ── Status change ──
    const statusLabels = {
      'In Review': { title: 'Under Review', description: 'Issue has been reviewed and assigned.' },
      'In Progress': { title: 'Repairs In Progress', description: 'Work has started on this issue.' },
      'Resolved': { title: 'Issue Resolved', description: 'The issue has been successfully resolved.' },
    };

    if (status && status !== issue.status) {
      issue.status = status;
      const label = statusLabels[status] || { title: status, description: '' };
      issue.timeline.push({
        status,
        title: label.title,
        description: resolutionNotes || label.description,
        author: req.user.fullName || 'Authority',
        authorType: 'authority',
      });
      if (status === 'Resolved') {
        await User.findByIdAndUpdate(issue.reportedBy, {
          $inc: { 'stats.resolvedReports': 1, points: 25 },
        });
      }
    }

    // ── Assignment change ──
    const deptChanged = assignDepartment && assignDepartment !== issue.assignedTo?.department;
    const officerChanged = assignOfficer && assignOfficer !== issue.assignedTo?.officer;

    if (deptChanged || officerChanged) {
      issue.assignedTo = {
        department: assignDepartment || issue.assignedTo?.department || '',
        officer: assignOfficer || issue.assignedTo?.officer || '',
        assignedAt: new Date(),
      };
      // Add to timeline so there's a record of who was assigned
      const assignDesc = [
        assignDepartment ? `Department: ${assignDepartment}` : null,
        assignOfficer ? `Officer: ${assignOfficer}` : null,
      ].filter(Boolean).join(', ');

      issue.timeline.push({
        status: issue.status,
        title: 'Issue Assigned',
        description: `Assigned to ${assignDesc}`,
        author: req.user.fullName || 'Authority',
        authorType: 'authority',
      });
    }

    // ── Other fields ──
    if (priority) issue.priority = priority;
    if (resolutionNotes) issue.resolutionNotes = resolutionNotes;
    if (officialMessage) {
      issue.officialUpdate = {
        message: officialMessage,
        from: officialFrom || req.user.fullName || 'City Council',
        timestamp: new Date(),
      };
    }

    await issue.save();
    res.json({ success: true, message: 'Issue updated successfully', issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/admin/issues/:id
const deleteAdminIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({
      $or: [
        { issueId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all citizen users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAdminIssues, getAdminIssue, updateAdminIssue, deleteAdminIssue, getUsers, DEPARTMENTS };
