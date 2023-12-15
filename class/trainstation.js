import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

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
  static async createTrainStationOnDatabase(name, open_hour, close_hour) {
    await mongoose.connect(process.env.MONGO_ADDRESS);
    const pushTrainStation= mongoose.model("trainstation", this.trainstationSchema);
    const image = "none";
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
    try {
    const trainstationParams = req.body;
    await trainstation.createTrainStationOnDatabase(trainstationParams.name, trainstationParams.open_hour, trainstationParams.close_hour);
    res.status(200);
    res.send("Train Station Created");
  } catch(error) {
    return res.status(500).send("Internal Server Error");
}
  }


  static async callbackGetTrainStationbyId(req, res) {
    try {
    await mongoose.connect(process.env.MONGO_ADDRESS);
    const id = req.params.id;
    const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
    console.log(await trainstationModel.findOne({_id:id}).exec());
    res.send('OK');
  } catch(error) {
    return res.status(500).send("Internal Server Error");
}
  }


static async callbackGetTrainStationbyName(req, res) {
  try {
  await mongoose.connect(process.env.MONGO_ADDRESS);
  const name = req.params.name;
  const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
  console.log(await trainstationModel.findOne({name: name}).exec())
  res.send('OK');
  } catch(error) {
  return res.status(500).send("Internal Server Error");
  }
}
  static async callbackDeleteTrainStationbyId(req, res) {
    try {
      await mongoose.connect(process.env.MONGO_ADDRESS);
      const id = req.body.id;
      const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
      const deletionResult = await trainstationModel.deleteOne({ _id: id }).exec();
      console.log(deletionResult);
      res.send("OK");
    } catch(error) {
      return res.status(500).send("Internal Server Error");
  }
  }
  static async callbackUpdateTrainStation(req, res) {
    try {
    await mongoose.connect(process.env.MONGO_ADDRESS);
    const body = req.body
    console.log(body)
    const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
    await trainstationModel.findByIdAndUpdate(body.id,{name:body.name, open_hour:body.open_hour,close_hour:body.close_hour, image:body.image}).exec();
    res.status(200).send("OK");
    } catch(error) {
    return res.status(500).send("Internal Server Error");
    }
  }

  static async callbackSetImage(req, res) {
    try {
      res.status(200).send('Image sent to server');
    }
     catch(error) {
      res.status(500).send("500 - Internal server Error");
    }

  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const destination = path.join('trainstation_images/');
      cb(null, destination);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const trainstationId = req.query.id;
      await mongoose.connect(process.env.MONGO_ADDRESS);
      const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
      const foundTrainstation = await trainstationModel.findOne({_id:trainstationId}).exec();
      const fileName = foundTrainstation.name + path.extname(file.originalname);

      const updatedTrainstation = await trainstationModel.updateOne({_id:trainstationId}, {image: fileName}).exec();
      cb(null, fileName);
    } catch (error) {
      cb(error, null);
    }
  },
});

export const upload = multer({
  storage: storage,
}).single('file'); 
