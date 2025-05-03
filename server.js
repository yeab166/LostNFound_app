const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');

dotenv.config();
const authRouter= require('../LostFoundNode/src/routes/authRoutes');
const claimsRouter = require('./src/routes/claims');
const adminRouter = require('./src/routes/admin')
const profileRouter = require('./src/routes/profile');

const app= express();
app.use(cors());
app.use(express.json());
app.use('/api',authRouter);

//  Routes

app.use('/api/claims', claimsRouter);
app.use('/api/admin', adminRouter); 
app.use('/api/profile', profileRouter);


const PORT= process.env.PORT || 8080;

app.listen(PORT, ()=>{
  console.log(`The surver run on port ${PORT}`);
});