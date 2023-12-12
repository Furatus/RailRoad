import mangoose from 'mongoose';
import mongoose from "mongoose";
export default class train {
    constructor(id, name, open_hour, close_hour, image) {
        this._id = id;
        this._name = name;
        this._start_station = start_station;
        this._end_station = end_station;
        this._time_of_departure = time_of_departure;
    }
    static trainSchema = new mongoose.Schema({
        name: String,
        start_station: String,
        end_station: String,
        time_of_departure:Date
    });


    static async callbackCreateTrain(req, res) {
        const trainParams = req.body;
        await train.createTrainOnDatabase(trainParams.name, trainParams.start_station, trainParams.end_station, trainParams.time_of_departure);
        res.status(200);
        res.send("Train Created");
    }
    static async createTrainOnDatabase(name, start_station, end_station, time_of_departure) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const pushTrain = mongoose.model("train", this.trainSchema);
        const sendTrain = new pushTrain({
            name: name,
            start_station: start_station,
            end_station: end_station,
            time_of_departure: time_of_departure
        });
        await sendTrain.save();
        return "Train Created" + sendTrain;
    }
    static async callbackGetTrainbyName(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const name = req.params.name;
        const trainModel = mongoose.model("train", train.trainSchema);
        console.log(await trainModel.findOne({ name: name }).exec())
        res.send('OK')
    }
    static async callbackGetTrainbyId(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.params.id;
        const trainModel = mongoose.model("train", train.trainSchema);
        console.log(await trainModel.findOne({ _id: id }).exec())
        res.send('Train Found')
    }
    static async callbackDeleteTrainbyId(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const trainModel = mongoose.model("train", train.trainSchema);
        const deletionResult = await trainModel.deleteOne({ _id: id }).exec();
        console.log(deletionResult);
        res.send("Train Deleted");
    }
    static async callbackUpdateTrain(req, res) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const name = req.body.name;
        const start_station = req.body.start_station;
        const end_station = req.body.end_station;
        const time_of_departure = req.body.time_of_departure;
        const trainModel = mongoose.model("train", train.trainSchema);
        const updateResult = await trainModel.updateOne({ _id: id }, { name: name, start_station: start_station, end_station: end_station, time_of_departure: time_of_departure }).exec();
        console.log(updateResult);
        res.send("Train Updated");
    }
    static async callbackGetAllTrain(req, res) {
        const params = req.query;
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const trainModel = mongoose.model("train", train.trainSchema);
        let results = await trainModel.find().exec();
        switch (params) {
            case params.start_station!==undefined:
                results = await results.find({start_station: start_station }).exec()
            case params.end_station!==undefined:
                return await results.find({end_station: end_station}).exec()
            default:
                console.log("Aucun resultat trouvé")
            break
        }
    console.log(results);
    }



}