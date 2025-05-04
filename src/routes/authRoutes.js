const express= require('express');
const multer = require('multer');


const {registerUser, loginUser, getUser}= require('../controller/authController');
const middleware= require('..//middleware/authMiddleware');
const {addLostItem, getLostItems, updateLostItem, deleteLostItem}= require('../controller/lostItemsController');
const {addFoundItem, getFoundItems, updateFoundItem, deleteFoundItem}= require('../controller/foundItemsController');
const claimRouter= require('../claimAndVerification/claim');
const adminVerifyRouter= require('../claimAndVerification/adminVerify');
const profileManagement= require('../profileManagement/profile');

const router= express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/user',middleware,getUser);
router.post('/api/lost', upload.single('image'), addLostItem);
router.get('/api/lost', getLostItems);
router.put('/api/lost/:id', updateLostItem);
router.delete('/api/lost/:id', deleteLostItem);
router.post('/api/found', upload.single('image'), addFoundItem);
router.get('/api/found', getFoundItems);
router.put('/api/found/:id', updateFoundItem);
router.delete('/api/found/:id', deleteFoundItem);
router.use('/claim', claimRouter);
router.use('/adminVerify',adminVerifyRouter);
router.use('/profile',profileManagement);

module.exports= router;
