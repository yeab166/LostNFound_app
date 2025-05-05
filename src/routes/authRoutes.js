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

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/user',authenticate,getUser);
router.post('/', upload.single('image'), addLostItem);
router.get('/',authenticate, getLostItems);
router.put('/:id', updateLostItem);
router.delete('/:id', deleteLostItem);
router.post('/', upload.single('image'), addFoundItem);
router.get('/',authenticate, getFoundItems);
router.put('/:id', updateFoundItem);
router.delete('/:id', deleteFoundItem);
router.use('/api/claims', claimRouter);
router.use('/api/admin',adminVerifyRouter);
router.use('/api/profile',profileManagement);

module.exports= router;
