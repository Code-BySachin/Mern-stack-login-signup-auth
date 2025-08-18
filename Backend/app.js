import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/authRoutes.js'

dotenv.config();
const app = express();

mongoDB();
const port = process.env.PORT;

app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.use('/api/auth',authRouter)

app.get('/',(req,res)=>{
    res.send('API Working')
})

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    
})