const express= require('express');

const {registerUser, loginUser, getUser}= require('../controller/authController');
const middleware= require('..//middleware/authMiddleware');
const {addLostItem}= require('../controller/lostItemsController');

const router= express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/user',middleware,getUser);
router.post('/getLost',addLostItem);

module.exports= router;