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
import messageRouter from './routes/message.routes.js';
import { app, server } from './socket.js';









const port=process.env.PORT;


app.use(express.json());     
app.use(cookieParser());     

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(cors({
    origin: "https://www.procoder.dpdns.org", 
    credentials: true 
  }));
  app.use(express.static("public"));


  
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);
app.use("/api/vibez",vibezRouter);
app.use("/api/story",storyRouter);
app.use("/api/message",messageRouter);


app.use("/temp", express.static(path.resolve("temp")));



app.get('/',(req,res)=>{
    res.json({message:"app is working"});
})

server.listen(port,()=>{
    connectDB()
    console.log("BAckend is running at:",port);
})
