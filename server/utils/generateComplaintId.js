const Complaint = require('../models/Complaint');

const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  const seq = String(count + 1).padStart(5, '0');
  return `SDM-${year}-${seq}`;
};

module.exports = generateComplaintId;
