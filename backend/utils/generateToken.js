import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: "15d"
    })
    res.cookie("jwtToken",token,{
        httpOnly:true,
        maxAge: 15*24*60*60*1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict'
    })
}

export default generateTokenAndSetCookie;