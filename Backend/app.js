import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoDB from './src/config/db.js';
import { connect } from 'mongoose';

dotenv.config();
const app = express();

mongoDB();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('API Working')
})

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    
})