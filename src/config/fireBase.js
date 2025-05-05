const admin= require('firebase-admin');

const dotenv= require('dotenv');

dotenv.config();

const serviceAccount= require('../service_account/firebase_service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

module.exports= admin;
