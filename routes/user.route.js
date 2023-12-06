import { user } from "../class/user.js";
import {Router} from "express";

const userRouter = Router();
userRouter.get("/id/:id", user.callbackGetUserById);
userRouter.get("/:name", user.callbackGetUserByName)
userRouter.post("/create", user.callbackCreateUser);


export default userRouter;