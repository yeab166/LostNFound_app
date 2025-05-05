const admin= require('../config/fireBase');
const { v4: uuidv4 } = require('uuid');

const db = admin.firestore();
const bucket = admin.storage().bucket();


// POST /api/lost - Report a new lost item
exports.addLostItem = async (req, res) => {
  try {
    const { title, description, location, dateLost } = req.body;
    const file = req.file;

    if (!title || !description || !location || !dateLost) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    let imageUrl = '';
    if (file) {
      const fileName = `lostItems/${uuidv4()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      imageUrl = (await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      }))[0];
    }

    const docRef = await db.collection('lostItems').add({
      title,
      description,
      location,
      dateLost,
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: docRef.id, message: 'Lost item reported.' });
  } catch (err) {
    console.error('Error adding lost item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/lostItems
exports.getLostItems = async (req, res) => {
  try {
    const snapshot = await db.collection('lostItems').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
};

// PUT /api/lost/:id - Update a lost item
exports.updateLostItem = async (req, res) => {
  try {
    const docRef = db.collection('lostItems').doc(req.params.id);
    await docRef.update(req.body);
    res.json({ message: 'Lost item updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item.' });
  }
};

// DELETE /api/lost/:id - Delete a lost item
exports.deleteLostItem = async (req, res) => {
  try {
    await db.collection('lostItems').doc(req.params.id).delete();
    res.json({ message: 'Lost item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
};

