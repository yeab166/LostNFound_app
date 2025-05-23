const express = require('express');
const admin= require('../config/fireBase');
const {authenticate} = require('../middleware/authMiddleware');
 
 const router = express.Router();
 const db = admin.firestore();

 // Get user profile (GET)
 router.get('/api/profile/get', authenticate, async (req, res) => {
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
 router.put('/api/profile/update', authenticate, async (req, res) => {
   await db.collection('users').doc(req.user.uid).update(req.body);
   res.send('Profile updated');
 });

module.exports= router;
