const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalUsers = await User.countDocuments({ role: 'citizen' });

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email');

    // Today's complaints
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayComplaints = await Complaint.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      dashboard: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalUsers,
        todayComplaints,
        recentComplaints
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get area-wise breakdown
// @route   GET /api/admin/areas
exports.getAreaBreakdown = async (req, res) => {
  try {
    const areas = await Complaint.aggregate([
      {
        $group: {
          _id: '$area',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $in: ['$status', ['Submitted', 'Under Review']] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ success: true, areas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
