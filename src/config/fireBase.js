const admin= require('firebase-admin');

const dotenv= require('dotenv');

dotenv.config();

const serviceAccount= require('../service-account/firebase_service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports= admin;