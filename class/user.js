import mongoose from "mongoose";

export class user {

    static userSchema = new mongoose.Schema({
        email: String,
        pseudo: String,
        password: String,
        role: String
    })

    constructor(email, pseudo, password, role) {
        this._email = email;
        this._pseudo = pseudo;
        this._password = password;
        this._role = role;
    }
    static async createUserOnDatabase(email,pseudo,password,role) {
        await mongoose.connect(serverAddress);

        const pushUser = mongoose.model("user",this.userSchema);
        const sendUser = new pushUser({
            email: email,
            pseudo: pseudo,
            password: password,
            role: role
        });
        await sendUser.save();
        return "ok";
    }

    static async getUserOnDatabaseById(serverAddress, id) {
        await mongoose.connect()
        const id = req.params.id;
    const trainstationModel = mongoose.model("trainstation", trainstation.trainstationSchema);
    console.log(typeof (await trainstationModel.findOne({_id:id}).exec()))
    res.send('OK');
    }

    static async callbackCreateUser(req,res) {
        const userParams = req.body;
        const createUser = await user.createUserOnDatabase(userParams.email,userParams.pseudo,userParams.password,userParams.role);
        res.status(200);
        res.send('Created user on database :' + createUser);
    }

    static async callbackGetUserById(req,res) {
        const id = req.params.id;

    }
}