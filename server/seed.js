const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');

const AREAS = [
  'Sector 1 - Downtown',
  'Sector 2 - Market Area',
  'Sector 3 - Industrial Zone',
  'Sector 4 - Residential Colony',
  'Sector 5 - Old City',
  'Sector 6 - University Area',
  'Sector 7 - Hospital Road',
  'Sector 8 - Railway Station',
  'Sector 9 - Bus Stand',
  'Sector 10 - Lake View'
];

const STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

const DESCRIPTIONS = [
  'Severe drainage blockage causing water logging on the main road. Water is overflowing from the manhole.',
  'Broken drainage cover near the school. Children are at risk of falling into the open drain.',
  'Foul smell from clogged drain near residential area. Mosquito breeding observed.',
  'Overflowing sewage water mixing with drinking water supply line.',
  'Rainwater not draining properly. Road completely submerged after light rain.',
  'Cracked drainage pipe leaking sewage onto the street. Very unhygienic conditions.',
  'Garbage dumped in storm water drain causing complete blockage.',
  'Manhole cover missing on busy street. Temporary barricade placed by locals.',
  'Drainage construction left incomplete. Exposed trenches posing danger to vehicles.',
  'Waterlogging in basement of building due to blocked municipal drain.',
  'Sewage overflow near food market. Health hazard for vendors and customers.',
  'Old drainage system collapsed. Sinkhole forming on the road surface.',
  'Illegal encroachment blocking natural drainage channel.',
  'Chemical waste from factory flowing into public drain. Colored water observed.',
  'Tree roots have damaged underground drainage pipes. Water seeping through road.'
];

const NAMES = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel',
  'Vikram Reddy', 'Anita Desai', 'Mohammed Ali', 'Kavita Joshi',
  'Suresh Nair', 'Deepa Menon', 'Rahul Gupta', 'Meena Iyer',
  'Arun Verma', 'Sunita Rao', 'Kiran Bhat', 'Pooja Mehta'
];

const WORKERS = [
  'Team Alpha - Ramesh', 'Team Beta - Sunil', 'Team Gamma - Prakash',
  'Team Delta - Mohan', 'Team Epsilon - Ravi'
];

// Random location around a city center (e.g., Hyderabad-like coordinates)
const randomLocation = () => ({
  lat: 17.385 + (Math.random() - 0.5) * 0.15,
  lng: 78.4867 + (Math.random() - 0.5) * 0.15
});

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (months = 12) => {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * months));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  d.setHours(Math.floor(Math.random() * 24));
  return d;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin Officer',
      email: 'admin@smartdrainage.gov',
      password: 'admin123',
      phone: '9999999999',
      address: 'Municipality Office, Sector 1',
      role: 'admin'
    });
    console.log('✅ Admin created: admin@smartdrainage.gov / admin123');

    // Create citizen users
    const citizens = [];
    for (let i = 0; i < 8; i++) {
      const user = await User.create({
        name: NAMES[i],
        email: `citizen${i + 1}@example.com`,
        password: 'citizen123',
        phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        address: `House ${Math.floor(Math.random() * 500) + 1}, ${randomItem(AREAS)}`,
        role: 'citizen'
      });
      citizens.push(user);
    }
    console.log('✅ 8 citizens created (citizen1@example.com ... citizen8@example.com / citizen123)');

    // Create complaints
    const complaints = [];
    for (let i = 0; i < 60; i++) {
      const citizen = randomItem(citizens);
      const status = randomItem(STATUSES);
      const area = randomItem(AREAS);
      const createdAt = randomDate(10);

      const statusHistory = [
        { status: 'Submitted', changedAt: createdAt, changedBy: citizen.name, remark: 'Complaint submitted' }
      ];

      if (['Under Review', 'In Progress', 'Resolved'].includes(status)) {
        const d2 = new Date(createdAt);
        d2.setDate(d2.getDate() + Math.floor(Math.random() * 3) + 1);
        statusHistory.push({ status: 'Under Review', changedAt: d2, changedBy: 'Admin Officer', remark: 'Reviewing complaint' });
      }
      if (['In Progress', 'Resolved'].includes(status)) {
        const d3 = new Date(statusHistory[statusHistory.length - 1].changedAt);
        d3.setDate(d3.getDate() + Math.floor(Math.random() * 5) + 1);
        statusHistory.push({ status: 'In Progress', changedAt: d3, changedBy: 'Admin Officer', remark: `Assigned to ${randomItem(WORKERS)}` });
      }
      if (status === 'Resolved') {
        const d4 = new Date(statusHistory[statusHistory.length - 1].changedAt);
        d4.setDate(d4.getDate() + Math.floor(Math.random() * 7) + 1);
        statusHistory.push({ status: 'Resolved', changedAt: d4, changedBy: 'Admin Officer', remark: 'Issue fixed and verified' });
      }

      const complaint = {
        complaintId: `SDM-2026-${String(i + 1).padStart(5, '0')}`,
        userId: citizen._id,
        name: citizen.name,
        phone: citizen.phone,
        address: `${Math.floor(Math.random() * 200) + 1}, Main Road, ${area}`,
        description: randomItem(DESCRIPTIONS),
        photo: '',
        location: randomLocation(),
        area,
        status,
        assignedWorker: ['In Progress', 'Resolved'].includes(status) ? randomItem(WORKERS) : '',
        remarks: status === 'Resolved' ? 'Issue has been resolved successfully.' : '',
        statusHistory,
        createdAt,
        updatedAt: statusHistory[statusHistory.length - 1].changedAt
      };

      complaints.push(complaint);
    }

    await Complaint.insertMany(complaints);
    console.log(`✅ ${complaints.length} complaints created`);

    console.log('\n🎉 Seed complete! Summary:');
    console.log(`   Admin: admin@smartdrainage.gov / admin123`);
    console.log(`   Citizens: citizen1@example.com ... citizen8@example.com / citizen123`);
    console.log(`   Complaints: ${complaints.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
