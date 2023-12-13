import jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import { user } from "./class/user.js";
import { role } from "./class/role.js";

export default async function mwVerifytoken(req,res,next) {
    const reqToken = req.headers.authorization;

    if (reqToken === undefined) {
        res.status(401);
        return res.send ("401 - token not found. Please provide a token");
    }

    try {
     const decoded = jwt.verify(reqToken,process.env.PASSPHRASE_TOKEN);
     
     try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", user.userSchema);
        const founduser = await userModel.findOne({ pseudo: decoded }).exec();
    
            if (!founduser) {
                return res.status(403).send("403 - Access Denied \nInvalid user.");
            }
    
            req.user = founduser;
        }
        catch (error) {
            return res.status(500).send("500 - Internal Server Error");
        }

    next();
    } catch (error) {
        return res.status(403).send("403 - Invalid Token. \n Please provide a valid token to have access to this ressource.");
    }
}

export function mwAuthorizeRole(requiredRight) {
    return async function(req,res,next) {
    const userRole = req.user.role;
    
    try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const roleModel = mongoose.model("role", role.roleSchema);
        const foundRole = await roleModel.findOne({role: userRole}).exec();
    if (!foundRole || !foundRole.permissions.includes(requiredRight)){
        res.status(403).send("403 - Access Denied \nyou must have more permissions to access this ressource.");
        req.user.isValid = false;
    }
    else {
    next();
    }
}
catch (error) {
    return res.status(500).send("500 - Internal Server Error");
}
    }
}