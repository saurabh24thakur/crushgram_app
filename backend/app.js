import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from  "cors";
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.routes.js';
import path from 'path';
import vibezRouter from './routes/vibez.routes.js';
import storyRouter from './routes/story.routes.js';








const app= express();
const port=process.env.PORT;


app.use(express.json());     
app.use(cookieParser());     

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
  }));
  app.use(express.static("public"));


  
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);
app.use("/api/vibez",vibezRouter);
app.use("/api/story",storyRouter);


app.use("/temp", express.static(path.resolve("temp")));



app.get('/',(req,res)=>{
    res.json({message:"app is working"});
})

app.listen(port,()=>{
    connectDB()
    console.log("BAckend is running at:",port);
})