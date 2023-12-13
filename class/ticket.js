import mongoose from "mongoose";

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

    static async createTicketOnDatabase(id_user, id_train, isValidate) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const pushTicket = mongoose.model("ticket", this.ticketSchema);
        const sendTicket = new pushTicket({
            id_user: id_user,
            id_train: id_train,
            isValidate: isValidate
        });
        await sendTicket.save();
        const populatedTicket = await sendTicket.populate('id_user').populate('id_train').execPopulate();
        return "Ticket Created" + populatedTicket;
    }

    static async callbackCreateTicket(req, res) {
        const ticketParams = req.body;
        const ticketCreated = await ticket.createTicketOnDatabase(ticketParams.id_user, ticketParams.id_train, ticketParams.isValidate);
        res.status(200);
        res.send(ticketCreated);
    }

    static async callbackValidateTicketbyId(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const updateResult = await ticketModel.updateOne({ _id: id }, { isValidate: true }).exec();
        console.log(updateResult);
        res.send("Ticket Validated");
    }

    static async callbackGetAllTickets(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const results = await ticketModel.find().populate('id_user').populate('id_train').exec();
        res.send(results);
    }

    static async callbackDeleteTicketbyId(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const ticketModel = mongoose.model("ticket", ticket.ticketSchema);
        const deletionResult = await ticketModel.deleteOne({ _id: id }).exec();
        console.log(deletionResult);
        res.send("Ticket Deleted");
    }
}