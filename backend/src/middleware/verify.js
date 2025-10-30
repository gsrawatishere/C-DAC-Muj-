import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();
dotenv.config();


export const verifyUser = async (req, res, next)=> {
  try {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(403).json({msg : "No access token found! (middleware)"})
    }
    const data = jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY);
    if(!data || !data.id){
        return res.status(403).json({msg : "Unauthorized user!"});
    }

    const id = data.id;

    const user = await prisma.user.findUnique({
        where : {id},
    });

    if(!user){
        return res.status(403).json({msg : "User not found!"});
    }
    
    req.user = user;
    next();

  } catch (error) {
     console.error("Error in verification",error);
     res.status(500).json({msg : "Error in verifying user", error})
  }
}

 
