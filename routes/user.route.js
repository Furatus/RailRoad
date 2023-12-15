import { user } from "../class/user.js";
import {Router} from "express";
import mwVerifytoken, { mwVerifyIfSelf } from "../auth.js";
import { mwAuthorizeRole } from "../auth.js";
import { role } from "../class/role.js";

//on initialise un routeur
const userRouter = Router();



// On definit les toutes routes de l'api
userRouter.get("/id/:id", mwVerifytoken, mwAuthorizeRole(["selfRead","canReadUser"]), mwVerifyIfSelf, user.callbackGetUserById);
userRouter.get("/:name", mwVerifytoken, mwAuthorizeRole(["selfRead","canReadUser"]), mwVerifyIfSelf, user.callbackGetUserByName);
userRouter.post("/create", user.callbackCreateUser);
userRouter.patch("/update", mwVerifytoken, mwAuthorizeRole(["selfUpdate","canUpdateUser"]), mwVerifyIfSelf, user.callbackUpdateUser);
userRouter.delete("/delete", mwVerifytoken, mwAuthorizeRole(["selfDelete","canDeleteUser"]), mwVerifyIfSelf, user.callbackDeleteUser);
userRouter.post("/login", user.callbackLogin);
userRouter.post("/role/create", mwVerifytoken, mwAuthorizeRole(["canCreateRole"]), role.callbackCreateRole);


//exporter la fonction pour l'utiliser dans l'index
export default userRouter;