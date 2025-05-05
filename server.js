const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');

dotenv.config();
const authRoutes = require('./src/routes/authRoutes');


const app= express();
app.use(cors());
app.use(express.json());
app.use('/api',authRoutes);


const PORT= process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`The server run on port ${PORT}`);
});
