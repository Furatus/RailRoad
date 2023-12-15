import trainstation from "../class/trainstation.js";
import {Router} from "express";
import mwVerifytoken from "../auth.js";
import { mwAuthorizeRole } from "../auth.js";
import { role } from "../class/role.js";

const trainstationRouter = Router();
trainstationRouter.get("/id/:id", trainstation.callbackGetTrainStationbyId);
trainstationRouter.post("/create", mwVerifytoken, trainstation.callbackCreateTrainStation);
trainstationRouter.get("/name/:name", trainstation.callbackGetTrainStationbyName);
trainstationRouter.delete("/delete", mwVerifytoken, /*mwAuthorizeRole["canDeleteTicket"],*/ trainstation.callbackDeleteTrainStationbyId);
trainstationRouter.patch("/update", trainstation.callbackUpdateTrainStation);


export default trainstationRouter;