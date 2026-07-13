const Complaint = require('../models/Complaint');
const User = require('../models/User');
const generateComplaintId = require('../utils/generateComplaintId');
const { sendStatusUpdateEmail } = require('../utils/sendEmail');

// @desc    Submit a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { name, phone, address, description, lat, lng, area } = req.body;

    const complaintId = await generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      userId: req.user._id,
      name,
      phone,
      address,
      description,
      photo: req.file ? `/uploads/${req.file.filename}` : '',
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      area: area || 'Unknown',
      status: 'Submitted',
      statusHistory: [{
        status: 'Submitted',
        changedAt: new Date(),
        changedBy: req.user.name,
        remark: 'Complaint submitted by citizen'
      }]
    });

    res.status(201).json({
      success: true,
      complaint,
      message: `Complaint registered! Your tracking ID is ${complaintId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints (with filters)
// @route   GET /api/complaints
exports.getComplaints = async (req, res) => {
  try {
    const { status, area, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (area && area !== 'all') query.area = area;
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If citizen, only show their complaints
    if (req.user.role === 'citizen') {
      query.userId = req.user._id;
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    res.json({
      success: true,
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email phone');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track complaint by ID
// @route   GET /api/complaints/track/:complaintId
exports.trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found. Please check the ID.' });
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('userId', 'email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (remarks) complaint.remarks = remarks;
    complaint.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user.name,
      remark: remarks || `Status changed to ${status}`
    });

    await complaint.save();

    // Send email notification
    if (complaint.userId && complaint.userId.email) {
      sendStatusUpdateEmail(complaint.userId.email, complaint.complaintId, status, remarks);
    }

    res.json({ success: true, complaint, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign worker to complaint (admin)
// @route   PUT /api/complaints/:id/assign
exports.assignWorker = async (req, res) => {
  try {
    const { worker, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.assignedWorker = worker;
    if (remarks) complaint.remarks = remarks;
    complaint.statusHistory.push({
      status: complaint.status,
      changedAt: new Date(),
      changedBy: req.user.name,
      remark: `Worker assigned: ${worker}. ${remarks || ''}`
    });

    await complaint.save();

    res.json({ success: true, complaint, message: `Worker ${worker} assigned successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'Submitted' });
    const underReview = await Complaint.countDocuments({ status: 'Under Review' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const activeUsers = await User.countDocuments({ role: 'citizen' });

    res.json({
      success: true,
      stats: {
        total,
        submitted,
        underReview,
        inProgress,
        resolved,
        pending: submitted + underReview + inProgress,
        activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics data for charts
// @route   GET /api/complaints/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Status distribution
    const statusDistribution = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Area-wise complaints
    const areaWise = await Complaint.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly complaints (last 12 months)
    const monthlyComplaints = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Location data for heatmap
    const locationData = await Complaint.find(
      { 'location.lat': { $exists: true } },
      { location: 1, status: 1, area: 1 }
    ).limit(500);

    res.json({
      success: true,
      analytics: {
        statusDistribution: statusDistribution.map(s => ({ name: s._id, value: s.count })),
        areaWise: areaWise.map(a => ({ area: a._id, complaints: a.count })),
        monthlyComplaints: monthlyComplaints.reverse().map(m => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          complaints: m.count
        })),
        locationData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints for map (public)
// @route   GET /api/complaints/map
exports.getMapComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find(
      {},
      { complaintId: 1, location: 1, status: 1, area: 1, description: 1, address: 1, createdAt: 1 }
    ).sort({ createdAt: -1 }).limit(500);

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
