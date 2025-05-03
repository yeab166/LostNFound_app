const express = require('express');
const multer = require('multer');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Multer for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/found
 * Report a new found item
 */
app.post('/api/found', upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, dateFound } = req.body;
    const file = req.file;

    let imageUrl = '';
    if (file) {
      const fileName = `foundItems/${uuidv4()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      imageUrl = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-01-2030'
      }).then(urls => urls[0]);
    }

    const docRef = await db.collection('foundItems').add({
      title,
      description,
      location,
      dateFound,
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id, message: 'Found item reported.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

/**
 * GET /api/found
 * Fetch all found items
 */
app.get('/api/found', async (req, res) => {
  try {
    const snapshot = await db.collection('foundItems').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

/**
 * PUT /api/found/:id
 * Update a found item
 */
app.put('/api/found/:id', async (req, res) => {
  try {
    const docRef = db.collection('foundItems').doc(req.params.id);
    await docRef.update(req.body);
    res.json({ message: 'Found item updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item.' });
  }
});

/**
 * DELETE /api/found/:id
 * Delete a found item
 */
app.delete('/api/found/:id', async (req, res) => {
  try {
    await db.collection('foundItems').doc(req.params.id).delete();
    res.json({ message: 'Found item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
