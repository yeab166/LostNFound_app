const admin= require('../config/fireBase');

exports.registerUser= async(req,res,next)=>{
  const {email,password}= req.body;

  try{
    const userRecord= await admin.auth().createUser({
      email,
      password
    });
    res.status(201).json({message:'User created successfully', userID: userRecord.uid});
  }catch(err){
    res.status(400).json({error:error.message});
  }
};

exports.loginUser= async(req,res,next)=>{
  res.status(201).json({message:'Firebase handle login via client SDK'});
};

exports.getUser= async(req,res,next)=>{
  const {uid}= req.user;

  try{
    const userRecord= await admin.auth().getUser(uid);
    res.status(201).json({user:userRecord});
  }catch(err){
    res.status(400).json({error:error.message});
  }
}
