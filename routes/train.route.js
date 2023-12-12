import train from "../class/train.js";
import {Router} from "express";

const trainRouter = Router();

trainRouter.post("/create", train.callbackCreateTrain);
trainRouter.get("/name/:name", train.callbackGetTrainbyName);
trainRouter.get("/id/:id", train.callbackGetTrainbyId);
trainRouter.delete("/delete", train.callbackDeleteTrainbyId);
trainRouter.patch("/update", train.callbackUpdateTrain);
trainRouter.get("/all", train.callbackGetAllTrain);


export default trainRouter;