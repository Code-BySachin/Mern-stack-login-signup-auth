import express from 'express';
import { login, logout, register, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/sendOtp', userAuth, sendVerifyOtp);
authRouter.post('/verifyemail', userAuth, verifyEmail);
authRouter.post('/send-reset-otp',sendResetOtp)

export default authRouter;