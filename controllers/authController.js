import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import User from "../models/userModel.js";
const saltrounds = 10;

export const registerUser = async (req,res) => {
    try{
        const emailcheck=req.body.email;
        const namecheck=req.body.userName;
        const foundEmail = await User.findOne({email:emailcheck});
        const foundName = await User.findOne({userName:namecheck});

        if(foundEmail) return res.status(400).json({ msg : "Email already exists."});
        if(foundName) return res.status(401).json({ msg : "Username already exists."});
        
        const {
            userName,
            email,
            password
        }=req.body;

        bcrypt.hash(password, saltrounds , async (err, hash) => {            // Helps to hash password
            if (err) {
                res.status(401).json({ msg: "Error" });       // If any error then send error
        }
    
        const newUser = new User({
            userName,
            email,
            password:hash
        });
        const user = await newUser.save();

        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET);
        res.status(201).json({user,token}); 
        }
    )
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}


export const loginUser = async (req,res) => {
    try{
        const { userName , password } = req.body;
        console.log(userName,password)
        const user = await User.findOne({ userName : userName });

        if(!user) return res.status(400).json({ msg : "User doesn't exist"});

        const ismatch = await bcrypt.compare(password,user.password);

        if(!ismatch) return res.status(400).json({ msg : "Invalid credentials"});

        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET);

        delete user.password;
        res.status(200).json({ token , user});
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}
