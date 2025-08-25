import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'All fields are mandatory' })
    }

    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.json({ success: false, message: 'user already exists !' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mail = await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: 'Welcome to CodeBySachin',
            text: `You have successfully registered to CodeBySachin website. Your account has been created with email id: ${email}`
        })

        return res.json({ success: true, message: 'User account created', MailMessageId: mail.messageId })

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.json({ success: false, message: 'All fields are mandatory !' })
    }
    try {

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: 'User logged in' })

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }


}

export const logout = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production'
        })

        return res.json({ success: true, message: 'Logged out' })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body || {};

        const user = await userModel.findById(userId);

        if (user.isAuthenticated) {
            return res.json({ success: false, message: 'Account is already verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 999999));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: 'Your OTP Verification Code',
            text: `Hello,

Your One-Time Password (OTP) is: ${otp}

This code is valid for the next 10 minutes. Please do not share it with anyone.

If you did not request this, please ignore this email.

Thank you,`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true,message:'verification OTP sent'})

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const verifyEmail = async (req,res)=>{
    const {userId,otp} = req.body || {};
    
    if(!userId || !otp){
        return res.json({success:false, message: 'user ID or otp not found'});
    }

    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:'Invalid user ID'})
        }
        if(user.verifyOtp !== otp){
            return res.json({success:false, message:'Invalid OTP'})
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:'OTP expired'})
        }

        user.isAuthenticated = true;
        await user.save();

        return res.json({success:true, message:'Email verified successfully'})
    }catch(err){
        return res.json({success:false, message:err.message})
    }
}

// send reset otp
export const sendResetOtp = async (req,res)=>{
    try{
        const {userId} = req.body;
        
        const user =  await userModel.findById(userId);

        if(!user){
            return res.json({success:false, message:'Invalid user ID'});
        }

        const otp = String(Math.floor(100000 + Math.random() * 999999));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: 'Account reset OTP',
            text: `Hello,

Your One-Time Password (OTP) is: ${otp}

This code is valid for the next 10 minutes. Please do not share it with anyone.

If you did not request this, please ignore this email.

Thank you,`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true,message:'Reset OTP sent'})

    }catch(err){
        return res.json({success:false, message: err.message})
    }
}