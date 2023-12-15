import mwVerifytoken, { mwAuthorizeRole } from "../auth.js";
import ticket from "../class/ticket.js";
import {Router} from "express";

const ticketRouter = Router();

// on définit nos routes pour le ticket
ticketRouter.post("/create", mwVerifytoken, ticket.callbackCreateTicket);
ticketRouter.post("/validate", mwVerifytoken, ticket.callbackValidateTicketbyId);
ticketRouter.get("/all", mwVerifytoken, mwAuthorizeRole(["canReadTicket"]), ticket.callbackGetAllTickets);
ticketRouter.delete("/delete", mwVerifytoken, mwAuthorizeRole(["canDeleteTicket"]), ticket.callbackDeleteTicketbyId);


export default ticketRouter;