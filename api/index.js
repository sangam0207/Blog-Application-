import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import postRouter from './routes/post.routes.js'
import CookieParser from 'cookie-parser';

import cors from 'cors';
dotenv.config()
const app=express();
app.use(cors());
app.use(express.json())
app.use(CookieParser());
// Database COnnection Start.. //
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Database Connected Successfully')
}).catch(()=>{
    console.log('Database Connection Failed')
})
// Database COnnection End.. //

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
app.listen(8000,()=>{
    console.log('server is running on port number 8000')
})