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

app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://api.procoder.dpdns.org",
      // Add your Cloudflare URL here once you have it
    ],
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

// Connect to DB immediately for Vercel
connectDB();

// Only listen if not running on Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
    server.listen(port, () => {
        console.log("Backend is running at:", port);
    });
}

// Export the app for Vercel
export default app;