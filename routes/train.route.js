import train from "../class/train.js";
import {Router} from "express";
import mwVerifytoken from "../auth.js";
import { mwAuthorizeRole } from "../auth.js";

const trainRouter = Router();

trainRouter.post("/create", mwVerifytoken, mwAuthorizeRole(["canCreateTrain"]), train.callbackCreateTrain);
trainRouter.get("/name/:name",  train.callbackGetTrainbyName);
trainRouter.get("/id/:id", train.callbackGetTrainbyId);
trainRouter.delete("/delete", mwVerifytoken, mwAuthorizeRole(["canDeleteTrain"]), train.callbackDeleteTrainbyId);
trainRouter.patch("/update", mwVerifytoken, mwAuthorizeRole(["canUpdateTrain"]), train.callbackUpdateTrain);
trainRouter.get("/all", train.callbackGetAllTrain);


export default trainRouter;