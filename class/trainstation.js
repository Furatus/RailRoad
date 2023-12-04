import mongoose from "mongoose";
export default class trainstation {
  constructor(id, name, open_hour, close_hour, image) {
    this._id = id;
    this._name = name;
    this._open_hour = open_hour;
    this._close_hour = close_hour;
    this._image = image;
  }
  static trainstationSchema = new mongoose.Schema({
    name: String,
    open_hour: String,
    close_hour: String,
    image: String
  });
  static async createTrainStationOnDatabase(serverAddress, name, open_hour, close_hour, image) {
    await mongoose.connect(serverAddress);
    const pushTrainStation= mongoose.model("trainstation", this.trainstationSchema);
    const sendTrainStation = new pushTrainStation({
      name: name,
      open_hour: open_hour,
      close_hour: close_hour,
      image: image
    });
    await sendTrainStation.save();
    return "Train Station Created" + sendTrainStation;
  }
  static async callbackCreateTrainStation(req, res) {
    const trainstationParams = req.body;
    await trainstation.createTrainStationOnDatabase(trainstationParams.name, trainstationParams.open_hour, trainstationParams.close_hour, trainstationParams.image);
    res.status(200);
    res.send("Train Station Created");
  }


  static async callbackGetTrainStationbyId(req, res) {
    await mongoose.connect(process.env.MONGO_ADDRESS);
    const id = req.params.id;
    const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
    console.log(await trainstationModel.findOne({_id:id}).exec())
    res.send('OK')
  }


static async callbackGetTrainStationbyName(req, res) {
  await mongoose.connect(process.env.MONGO_ADDRESS);
  const name = req.params.name;
  const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
  console.log(await trainstationModel.findOne({name: name}).exec())
  res.send('OK')
}
}