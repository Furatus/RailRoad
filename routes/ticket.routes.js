import ticket from "../class/ticket.js";
import {Router} from "express";

const ticketRouter = Router();

ticketRouter.post("/create", ticket.callbackCreateTicket);
ticketRouter.post("/validate", ticket.callbackValidateTicketbyId);
ticketRouter.get("/all", train.callbackGetAllTickets);
ticketRouter.delete("/delete", train.callbackDeleteTicketbyId);


export default ticketRouter;