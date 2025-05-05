const express= require('express');
const multer = require('multer');


const {registerUser, loginUser, getUser}= require('../controller/authController');
const {authenticate} = require('../middleware/authMiddleware');
const {addLostItem, getLostItems, updateLostItem, deleteLostItem}= require('../controller/lostItemsController');
const {addFoundItem, getFoundItems, updateFoundItem, deleteFoundItem}= require('../controller/foundItemsController');
const claimRouter= require('../claimAndVerification/claim');
const adminVerifyRouter= require('../claimAndVerification/adminVerify');
const profileManagement= require('../profileManagement/profile');

const router= express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/auth/register',registerUser);
router.post('/api/auth/login',loginUser);
router.get('/api/auth/user',authenticate,getUser);
router.post('/api/add/lost', upload.single('image'), addLostItem);
router.get('/api/get/lost',authenticate, getLostItems);
router.put('/api/update/lost/:id', updateLostItem);
router.delete('/api/delete/lost/:id', deleteLostItem);
router.post('/api/add/found', upload.single('image'), addFoundItem);
router.get('/api/get/found',authenticate, getFoundItems);
router.put('/api/update/found/:id', updateFoundItem);
router.delete('/api/delete/found/:id', deleteFoundItem);
router.use('/api/claims', claimRouter);
router.use('/api/admin',adminVerifyRouter);
router.use('/api/profile',profileManagement);

module.exports= router;
