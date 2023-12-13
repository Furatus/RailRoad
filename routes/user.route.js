import { user } from "../class/user.js";
import {Router} from "express";
import mwVerifytoken from "../auth.js";
import { mwAuthorizeRole } from "../auth.js";
import { role } from "../class/role.js";

//on initialise un routeur
const userRouter = Router();



// On definit les routes de l'api
userRouter.get("/id/:id", mwVerifytoken, mwAuthorizeRole("canReadUser"), user.callbackGetUserById);
userRouter.get("/:name", mwVerifytoken, mwAuthorizeRole("canReadUser"), user.callbackGetUserByName);
userRouter.post("/create", user.callbackCreateUser);
userRouter.patch("/update", user.callbackUpdateUser);
userRouter.delete("/delete", mwVerifytoken, user.callbackDeleteUser);
userRouter.post("/login", user.callbackLogin);
userRouter.post("/role/create", role.callbackCreateRole);


//exporter la fonction pour l'utiliser dans l'index
export default userRouter;