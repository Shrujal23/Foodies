/**
 * Migration: Add admin role to existing admin account
 * Run this to update the database schema and set admin role
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrateAdminRole() {
  try {
    // Create connection pool
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'foodies'
    });

    console.log('✅ Connected to database');

    // Check if role column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
    `);

    if (columns.length === 0) {
      console.log('Adding role column to users table...');
      
      // Add role column if it doesn't exist
      await connection.execute(`
        ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER avatar_url
      `);

      console.log('✅ Role column added');
    } else {
      console.log('✅ Role column already exists');
    }

    // Set admin role for admin@gmail.com
    await connection.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      ['admin', 'admin@gmail.com']
    );

    // Verify
    const [admin] = await connection.execute(
      'SELECT id, username, email, role FROM users WHERE email = ?',
      ['admin@gmail.com']
    );

    console.log('✅ Admin role configured!');
    console.log('Admin user:', admin[0]);

    await connection.end();
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateAdminRole();
