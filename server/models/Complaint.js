const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: 2000
  },
  photo: {
    type: String,
    default: ''
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  area: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
    default: 'Submitted'
  },
  assignedWorker: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: String,
    remark: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
complaintSchema.index({ status: 1 });
complaintSchema.index({ area: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
