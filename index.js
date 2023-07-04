import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import database from "./config/database.js";
import authRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messages.js";

import User from "./models/userModel.js";


// Configurations 
dotenv.config({path:"config/.env"});


const app = express();
app.use(express.json());
app.use(bodyParser.json({limit : "30mb" , extended : true}));
app.use(bodyParser.urlencoded({limit : "30mb" , extended : true}));


const corsOptions = {
  // origin: "http://localhost:3000", 
  origin: "https://chatapp-frontend-blond.vercel.app", 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); 


// to serve images inside public folder
app.use(express.static('public')); 
app.use('/images', express.static('images'));


//Routes
app.use("/auth",authRoutes);
app.use("/user",chatRoutes);
app.use("/chat",messageRoutes);

//mongoose connection
database();

//connection
const server = app.listen(process.env.PORT,(req,res,err)=>{
    if(err)
        console.log(err);
    else
        console.log(`Server is listening on port : ${process.env.PORT}`)
});

const io = new Server(server, {
  cors: {
    origin: "https://chatapp-frontend-blond.vercel.app",
    methods: ["GET", "POST"],
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log("data",data)
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
