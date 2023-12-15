import mongoose from "mongoose";
import train from "./train.js";

export default class ticket {
    constructor(id, id_user, id_train, isValidate) {
        this._id = id;
        this._id_user = id_user;
        this._id_train = id_train;
        this._isValidate = isValidate;
    }

    static ticketSchema = new mongoose.Schema({
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        id_train: { type: mongoose.Schema.Types.ObjectId, ref: 'train' },
        isValidate: Boolean
    });

    static async createTicketOnDatabase(id_user, id_train) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const pushTicket = mongoose.model("ticket", this.ticketSchema);
        const isValidate = false;
        const sendTicket = new pushTicket({
            id_user: id_user,
            id_train: id_train,
            isValidate: isValidate
        });
        await sendTicket.save();
        //const populatedTicket = await sendTicket.populate('id_user').populate('id_train').execPopulate();
        return "Ticket Created" + populatedTicket;
    }

    static async callbackCreateTicket(req, res) {
        try {
        const ticketParams = req.body;
        //Rechercher dans la base un train qui correspond à l'id
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const trainModel = mongoose.model("train", train.trainSchema);
        const trainFound = await trainModel.findOne({ _name: req.body.name }).exec();
        console.log(trainFound);
        if (trainFound == null) {
            res.status(404);
            res.send("Train not found");
            return;
            
        }

        const ticketCreated = await ticket.createTicketOnDatabase(ticketParams.id_user, ticketParams.id_train);
        res.status(200);
        res.send(ticketCreated);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackValidateTicketbyId(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const updateResult = await ticketModel.updateOne({ _id: id }, { isValidate: true }).exec();
        if (!updateResult) return res.status(404).send("404 - ticket not found");
        console.log(updateResult);
        res.send("Ticket Validated");
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackGetAllTickets(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const results = await ticketModel.find().exec();
        if (!results) return res.status(404).send("404 - ticket not found");
        res.status(200).send(results);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackDeleteTicketbyId(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const deletionResult = await ticketModel.deleteOne({ _id: id }).exec();
        if (!deletionResult) return res.status(404).send("404 - ticket not found");
        console.log(deletionResult);
        res.send("Ticket Deleted");
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }
}