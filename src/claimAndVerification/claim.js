const admin= require('../config/fireBase');
const express = require('express');
const authenticate = require('../middleware/authMiddleware'); // authentication from the middleware 
 
const db = admin.firestore();
const router = express.Router();
 
 // Claim a found item (POST)
 router.post('/', authenticate, async (req, res) => {
   try {
     const { itemId, message } = req.body;
     const userId = req.user.uid; // From JWT middleware
 
     // Validate item exists and is found
     const itemRef = db.collection('items').doc(itemId);
     const item = await itemRef.get();
 
     if (!item.exists || item.data().type !== 'found') {
       return res.status(404).json({ error: 'Found item not available' });
     }
 
     // Create claim in Firestore
     const claimRef = await db.collection('claims').add({
       itemId,
       userId,
       message,
       status: 'pending',
       createdAt: admin.firestore.FieldValue.serverTimestamp()
     });
 
     res.status(201).json({ claimId: claimRef.id });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

 module.exports= router;
