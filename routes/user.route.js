import { user } from "../class/user.js";
import {Router} from "express";

const userRouter = Router();
userRouter.get("/id/:id", user.callbackGetUserById);
userRouter.get("/:name", user.callbackGetUserByName)
userRouter.post("/create", user.callbackCreateUser);
userRouter.patch("/update", user.callbackUpdateUser);
userRouter.delete("/delete", user.callbackDeleteUser);


export default userRouter;