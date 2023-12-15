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
        const foundUser = await userModel.findOne({_id: decoded._id }).exec();
            if (!foundUser) {
                return res.status(403).send("403 - Access Denied \nInvalid user.");
            }
    
            req.user = foundUser;
        }
        catch (error) {
            return res.status(500).send("500 - Internal Server Error");
        }

    next();
    } catch (error) {
        return res.status(403).send("403 - Invalid Token. \n Please provide a valid token to have access to this ressource.");
    }
}

/*
keeping this old function in case of the new doesn't work

export function mwAuthorizeRole(requiredRight) {
    return async function(req,res,next) {
    const userRole = req.user.role;
    
    try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const roleModel = mongoose.model("role", role.roleSchema);
        const foundRole = await roleModel.findOne({role: userRole}).exec();
    if (!foundRole || !requiredRight.some(right => foundRole.permissions.includes(right))){
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
*/

export function mwAuthorizeRole(requiredRights) {
    return async function(req, res, next) {
        const userRole = req.user.role;
        let usedPermission = null;
        
        try {
            await mongoose.connect(process.env.MONGO_ADDRESS);
            const roleModel = mongoose.model("role", role.roleSchema);
            const foundRole = await roleModel.findOne({ role: userRole }).exec();

            if (!foundRole || !requiredRights.some(right => {
                if (foundRole.permissions.includes(right)) {
                    usedPermission = right;
                    return true;
                }
                return false;
            })) {
                res.status(403).send("403 - Access Denied \nyou must have more permissions to access this ressource.");
                req.user.isValid = false;
            } else {
                req.user.usedPermission = usedPermission;
                next();
            }
        } catch (error) {
            return res.status(500).send("500 - Internal Server Error");
        }
    }
}

export async function mwVerifyIfSelf(req,res,next) {
    try {
    const username = req.user.pseudo;
    if (req.user.usedPermission.startsWith('self', 0)) { 
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", user.userSchema);
        const foundUser = await userModel.findOne({_id: req.body.id}).exec();
    if (!foundUser || foundUser.pseudo !== username){
        res.status(403).send("403 - Forbidden \nyou're not allowed to modify or see other users");
        req.user.isValid = false;
    }
    else {
    next();
    }
}
else next();
}
catch (error) {
    return res.status(500).send("500 - Internal Server Error");
}
}