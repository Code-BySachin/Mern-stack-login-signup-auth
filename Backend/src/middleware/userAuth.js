import jwt from 'jsonwebtoken';

const userAuth = (req,res,next)=>{
    const {token} = req.cookies || {};

    if(!token){
        return res.json({success:false, message:'Not authorized: login again'})
    }
    try{

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        
        if(decodedToken.id){
            req.body.userId = decodedToken.id;
        }else{
            return res.json({success:false, message:'Not authorized: login again'});
        }
        
        next()

    }catch(err){
        return res.json({success:false,message:err.message})
    }
}

export default userAuth;