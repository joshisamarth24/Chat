import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    const {fullName,username,email,password,confirmPassword,profilePic} = req.body;
    try {
        if(password !== confirmPassword) return res.status(400).json({message: "Password doesn't match."});
        const user = await User.findOne({username});
        if(user) return res.status(400).json({message: "Username already exists."});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword,
            profilePic
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                userName:newUser.username,
                profilePic:newUser.profilePic
            })
        } else {
            res.status(400).json({message: "Invalid user data."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
        
    }
};



export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect) return res.status(400).json({message: "Invalid credentials."});
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.username,
            profilePic:user.profilePic
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("jwtToken");
        res.status(200).json({message: "User logged out successfully."});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }   
};