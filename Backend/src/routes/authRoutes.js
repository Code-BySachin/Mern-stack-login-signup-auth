import express from 'express';
import { login, logout, register, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetOtp } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/sendOtp', userAuth, sendVerifyOtp);
authRouter.post('/verifyemail', userAuth, verifyEmail);
authRouter.post('/send-reset-otp',userAuth,sendResetOtp)
authRouter.post('/verify-reset-otp',userAuth,verifyResetOtp);

export default authRouter;