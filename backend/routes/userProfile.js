const express = require('express');
const multer = require('multer');
const path = require('path');
const { updateUserProfile, findUserById } = require('../db/database');
const isAuthenticated = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/profileValidation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

router.put('/profile', isAuthenticated, upload.single('avatar'), validateProfileUpdate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, display_name, email, avatar_url } = req.body;
    let avatarUrl = avatar_url;

    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updated = await updateUserProfile(userId, {
      username,
      display_name,
      email,
      avatar_url: avatarUrl
    });

    if (!updated) {
      return res.status(500).json({ success: false, message: 'Unable to update profile' });
    }

    const freshUser = await findUserById(userId);
    return res.json({ success: true, user: freshUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;
