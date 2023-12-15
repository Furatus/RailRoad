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
        try {
        const trainParams = req.body;
        await train.createTrainOnDatabase(trainParams.name, trainParams.start_station, trainParams.end_station, trainParams.time_of_departure);
        res.status(200);
        res.send("Train Created");
        } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
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
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const name = req.params.name;
        const trainModel = mongoose.model("train", train.trainSchema);
        const foundTrain  = await trainModel.findOne({ name: name }).exec();
        if (!foundTrain) return res.status(404).send("404 - train not found");
        res.send(foundTrain);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
    }
    }
    static async callbackGetTrainbyId(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.params.id;
        const trainModel = mongoose.model("train", train.trainSchema);
        const foundTrain  = await trainModel.findOne({ _id: id }).exec();
        if (!foundTrain) return res.status(404).send("404 - train not found");
        res.send(foundTrain);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
    }
    }
    static async callbackDeleteTrainbyId(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const trainModel = mongoose.model("train", train.trainSchema);
        const deletionResult = await trainModel.deleteOne({ _id: id }).exec();
        console.log(deletionResult);
        if(deletionResult.deletedCount === 0) return res.status(404).send("404 - Train not found");
        res.send("Train Deleted");
        } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }
    static async callbackUpdateTrain(req, res) {
        try {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const id = req.body.id;
        const name = req.body.name;
        const start_station = req.body.start_station;
        const end_station = req.body.end_station;
        const time_of_departure = req.body.time_of_departure;
        const trainModel = mongoose.model("train", train.trainSchema);
        const updateResult = await trainModel.updateOne({ _id: id }, { name: name, start_station: start_station, end_station: end_station, time_of_departure: time_of_departure }).exec();
        if(updateResult.matchedCount === 0) return res.status(404).send("404 - Train not found");
        if(updateResult.modifiedCount === 0) return res.status(304).send("304 - Not modified");
        console.log(updateResult);
        res.send(updateResult);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }
    static async callbackGetAllTrain(req, res) {
        try {
        const params = req.query;
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const trainModel = mongoose.model("train", train.trainSchema);
        let filters = {}
        let tri = {}
        let limit=10
        if ( params.start_station!==undefined){
            filters= Object.assign(filters, {start_station: params.start_station});
        }

        if ( params.end_station!==undefined){
            filters= Object.assign(filters, {end_station: params.end_station});
        }
        if ( params.date!==undefined){
            filters= Object.assign(filters, {end_station: params.date});
        }
        if ( params.limit!==undefined){
            limit= params.limit
        }

        if ( params.sortDate!==undefined){
            console.log(typeof params.sortDate)
            if (params.sortDate==='asc'){
                tri= Object.assign(tri, {time_of_departure: 1});
            }
            else if (params.sortDate==='desc'){
                tri= Object.assign(tri, {time_of_departure: -1});
            }
            else {
                res.send('date doit etre asc ou desc')

            }
        }
        //console.log('les filtres',filters)
        //console.log('le tri',tri)

        const results = await trainModel.find(filters).sort(tri).limit(limit).exec()
        if(JSON.stringify(results)==='[]') {
            res.send("Aucun resultat trouvé")
        }
        else res.send(results);
    } catch(error) {
        return res.status(500).send("Internal Server Error");
        }
    }
}