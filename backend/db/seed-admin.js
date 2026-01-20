/**
 * Seed Admin Account
 * Run this once to create a mock admin account
 * Usage: node db/seed-admin.js (from backend directory)
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedAdmin() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin';
  const adminUsername = 'admin';

  try {
    // Create connection pool
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'foodies'
    });

    console.log('✅ Connected to database');

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin account already exists!');
      console.log('Email:', existingAdmin[0].email);
      console.log('Username:', existingAdmin[0].username);
      await connection.end();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = 'admin-' + Date.now().toString();
    const avatarUrl = 'https://ui-avatars.com/api/?name=Admin&background=FF6B6B&color=fff';

    // Create admin user
    await connection.execute(
      `INSERT INTO users (id, username, display_name, email, password_hash, avatar_url, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, adminUsername, 'Admin', adminEmail, hashedPassword, avatarUrl, 'admin']
    );

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('📝 Admin Credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin');
    console.log('');

    // Verify the account was created
    const [newAdmin] = await connection.execute(
      'SELECT id, username, display_name, email FROM users WHERE email = ?',
      [adminEmail]
    );

    if (newAdmin.length > 0) {
      console.log('✅ Verification successful!');
      console.log('Admin user:', newAdmin[0]);
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error seeding admin account:', error.message);
    process.exit(1);
  }
}

seedAdmin();
