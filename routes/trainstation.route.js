import trainstation from "../class/trainstation.js";
import {Router} from "express";
import mwVerifytoken from "../auth.js";
import { mwAuthorizeRole } from "../auth.js";
import { upload } from "../class/trainstation.js";

const trainstationRouter = Router();

// on définit les routes du trainstation
trainstationRouter.get("/id/:id", trainstation.callbackGetTrainStationbyId);
trainstationRouter.post("/create", mwVerifytoken, mwAuthorizeRole(["canCreateTrainstation"]), trainstation.callbackCreateTrainStation);
trainstationRouter.get("/name/:name", trainstation.callbackGetTrainStationbyName);
trainstationRouter.delete("/delete", mwVerifytoken, mwAuthorizeRole(["canDeleteTrainstation"]), trainstation.callbackDeleteTrainStationbyId);
trainstationRouter.patch("/update", mwVerifytoken, mwAuthorizeRole(["canUpdateTrainstation"]), trainstation.callbackUpdateTrainStation);
trainstationRouter.post("/setimage", mwVerifytoken, mwAuthorizeRole(["canUpdateTrainstation"]), upload, trainstation.callbackSetImage)

export default trainstationRouter;