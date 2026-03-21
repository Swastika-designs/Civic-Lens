/**
 * Run once: node seed.js
 * Creates the admin account in the users collection.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const admins = [
    {
      fullName: 'Super Admin',
      email: 'admin@civiclens.gov',
      password: 'Admin@123456',
      role: 'admin',
    },
    {
      fullName: 'Roads Authority',
      email: 'roads@civiclens.gov',
      password: 'Admin@123456',
      role: 'authority',
    },
  ];

  for (const a of admins) {
    const exists = await User.findOne({ email: a.email });
    if (exists) {
      console.log(`⚠️  Skipping ${a.email} — already exists`);
      continue;
    }
    await User.create(a);
    console.log(`✅ Created [${a.role}] ${a.email}  password: ${a.password}`);
  }

  console.log('\nAdmin login URL: http://localhost:5173/admin/login');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
