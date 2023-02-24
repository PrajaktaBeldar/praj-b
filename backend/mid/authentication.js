const ErrorHandler = require("../class/errorHandler");
const catchAsyncError=require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User=require("../model/peopleModel");

const isAuthenticatedPeople=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies; 
    if(!token){
        return next(new ErrorHandler("please login to access resource",401));
    }
  
    const decodedData=jwt.verify(token,process.env.JWT_SECRETKEY);
  req.user= await User.findById(decodedData.id);
  next();    
});  

authorizeRoles=(...roles)=>{
      return (req,res,next)=>{
          if(!roles.includes(req.user.role))
          {
          return next(new ErrorHandler( 
            `Role:${req.user.role} is not allowed to access this resource`,403
           ));
          }
         next();
      }; 
};

module.exports={
  isAuthenticatedPeople,
  authorizeRoles,
};