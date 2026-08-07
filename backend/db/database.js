const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function findOrCreateUser(profile) {
  try {
    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [profile.id]
      );

      if (rows.length > 0) {
        // Update existing user
        await connection.execute(
          `UPDATE users
           SET username = ?, display_name = ?, email = ?, avatar_url = ?
           WHERE id = ?`,
          [profile.username, profile.displayName, profile.email, profile.avatar, profile.id]
        );
        return rows[0];
      }

      // Create new user
      await connection.execute(
        `INSERT INTO users (id, username, display_name, email, avatar_url)
         VALUES (?, ?, ?, ?, ?)`,
        [profile.id, profile.username, profile.displayName, profile.email, profile.avatar]
      );

      const [newUser] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [profile.id]
      );

      return newUser[0];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    // Return a mock user if database fails
    return {
      id: profile.id,
      username: profile.username,
      display_name: profile.displayName,
      email: profile.email,
      avatar_url: profile.avatar
    };
  }
}

async function createUserWithPassword(username, email, password) {
  try {
    const connection = await pool.getConnection();
    try {
      // 12 rounds: stronger than default 10; still reasonable for signup latency
      const hashedPassword = await bcrypt.hash(password, 12);
      const id = Date.now().toString();

      await connection.execute(
        `INSERT INTO users (id, username, display_name, email, password_hash, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, username, username, email, hashedPassword, `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`]
      );

      const [newUser] = await connection.execute(
        'SELECT id, username, display_name, email, avatar_url FROM users WHERE id = ?',
        [id]
      );

      return newUser[0];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error creating user:', error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error finding user:', error);
    return null;
  }
}

async function findUserByEmailOrUsername(identifier) {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [identifier, identifier]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error finding user by identifier:', error);
    return null;
  }
}

async function findUserById(id) {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, username, display_name, email, avatar_url, role FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error finding user by id:', error);
    return null;
  }
}

async function updateUserProfile(id, profile) {
  try {
    const connection = await pool.getConnection();
    try {
      const fields = [];
      const values = [];

      if (profile.username !== undefined) {
        fields.push('username = ?');
        values.push(profile.username);
      }
      if (profile.display_name !== undefined) {
        fields.push('display_name = ?');
        values.push(profile.display_name);
      }
      if (profile.email !== undefined) {
        fields.push('email = ?');
        values.push(profile.email);
      }
      if (profile.avatar_url !== undefined) {
        fields.push('avatar_url = ?');
        values.push(profile.avatar_url);
      }
      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      await connection.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error updating user profile:', error);
    return false;
  }
}

async function verifyPassword(user, password) {
  return await bcrypt.compare(password, user.password_hash);
}

module.exports = {
  pool,
  findOrCreateUser,
  createUserWithPassword,
  findUserByEmail,
  findUserByEmailOrUsername,
  findUserById,
  verifyPassword,
  updateUserProfile
};
