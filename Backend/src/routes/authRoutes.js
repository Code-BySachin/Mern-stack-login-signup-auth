import express from 'express';
import { login, logout, register, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';


const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/sendOtp',sendVerifyOtp);
authRouter.post('/verifyemail',verifyEmail);
authRouter.post('/send-reset-otp',sendResetOtp)

export default authRouter;