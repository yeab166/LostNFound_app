const express = require('express');
const router = express.Router();
const { db } = require('../config/fireBase');
const authenticate = require('../middleware/authMiddleware');

// Verify admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// GET /api/admin/claims - View pending claims
router.get('/claims', authenticate, isAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('claims')
      .where('status', '==', 'pending')
      .get();

    const claims = [];
    snapshot.forEach(doc => {
      claims.push({ id: doc.id, ...doc.data() });
    });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/claims/:id/approve - Approve claim
router.post('/claims/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const claimId = req.params.id;
    
    // Update claim status
    await db.collection('claims').doc(claimId).update({
      status: 'approved',
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update item status
    const claim = await db.collection('claims').doc(claimId).get();
    await db.collection('items').doc(claim.data().foundItemId).update({
      status: 'returned'
    });

    res.json({ message: 'Claim approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/claims/:id/reject - Reject claim
router.post('/claims/:id/reject', authenticate, isAdmin, async (req, res) => {
  try {
    await db.collection('claims').doc(req.params.id).update({
      status: 'rejected',
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Claim rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;