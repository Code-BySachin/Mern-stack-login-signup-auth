import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('API Working')
})

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    
})