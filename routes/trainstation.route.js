import trainstation from "../class/trainstation.js";
import {Router} from "express";

const trainstationRouter = Router();
trainstationRouter.get("/id/:id", trainstation.callbackGetTrainStationbyId);
trainstationRouter.post("/create", trainstation.callbackCreateTrainStation);
trainstationRouter.get("/name/:name", trainstation.callbackGetTrainStationbyName);
trainstationRouter.delete("/delete", trainstation.callbackDeleteTrainStationbyId);
trainstationRouter.patch("/update", trainstation.callbackUpdateTrainStation);


export default trainstationRouter;