const express = require('express');
const router = express.Router();
const { db } = require('../');
const authenticate = require('../');

// Get user profile (GET)
router.get('/', authenticate, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(userDoc.data());
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
      }
});

// Update profile (put)
router.put('/', authenticate, async (req, res) => {
  await db.collection('users').doc(req.user.uid).update(req.body);
  res.send('Profile updated');
});

module.exports = router;