import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req,res)=>{
    const {name,email,password} =req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:'All fields are mandatory'})
    }

    try{
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
           return res.json({success:false,message:'user already exists !'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        });
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            secure:process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true,message:'User account created'})

    }catch(err){
        return res.json({success:false,message:err.message})
    }
}