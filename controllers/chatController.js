import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const chat = async (req,res) => {
    try{
        const { userName ,urlPicture } = req.body;
        console.log(userName,urlPicture);

        const isUser = await User.findOne({ userName : userName });

        console.log(isUser)
        if(!isUser) return res.status(400).json({ msg : "User doesn't exist"});

        const updatedUser = await User.findOneAndUpdate({ userName : userName },{ isAvatarSet : true , avatarPicture : urlPicture },{new: true});

        res.status(200).json({ updatedUser });
        
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}

export const allUsers = async (req,res) => {
    console.log("1")
    try{
        const { id } = req.params;
        console.log(id)
        const users = await User.find({ _id : { $ne : id }});

        console.log("1")
        console.log(users)
        res.status(200).json(users);
        
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}

export const getOwner = async (req,res) => {
    console.log("1")
    try{
        const { id } = req.params;
        console.log(id)
        const user = await User.findById(id);

        console.log("2")
        console.log(user)
        res.status(200).json(user);
        
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}

export const getMessages = async (req,res) => {
    console.log("a")
    try{
        const { from , to } = req.body;
        console.log("b")

        const allMessages = await Message.find({
            users:{
                $all : [from , to],
            }
        }).sort({updatedAt : 1});

        const projectedMessages = allMessages.map((msg) => {
            return {
              fromSelf: msg.sender.toString() === from,
              message: msg.message.text,
            };
          });
          console.log("c")
          res.status(200).json(projectedMessages);
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}

export const addMessage = async (req,res) => {
    try{
        const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });

    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}