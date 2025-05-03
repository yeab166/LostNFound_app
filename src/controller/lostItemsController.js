const admin= require('../config/fireBase');

exports.addLostItem = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  await authenticate(req, res, async () => {
    const { title, description, location, dateLost } = req.body;
    if (!title || !description || !location || !dateLost) {
      return res.status(400).send('Missing fields');
    }
    const item = {
      title, description, location, dateLost,
      userId: req.user.uid,
      status: 'lost',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('lostItems').add(item);
    return res.status(201).send({ id: docRef.id });
  });
});
