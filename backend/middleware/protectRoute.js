import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;
        
        if(!token) {
            res.status(401).json({message: "Not authorized, no token"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            res.status(401).json({message: "Not authorized, token failed"});
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user) {
            res.status(404).json({message: "User not found"});
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Not authorized, token failed"});
    }
};

export default protectRoute;