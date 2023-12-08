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
        await mongoose.connect(process.env.MONGO_ADDRESS);

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

    static async getUserOnDatabaseById(id) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
    const userModel = mongoose.model("user", this.userSchema);
    const user = await userModel.findOne({_id:id}).exec();
    return user;
    }

    static async getUserOnDatabaseByName(name) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        const user = await userModel.findOne({pseudo:name}).exec();
        return user;
    }

    static async updateUserOnDatabase(id,userObj) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        await userModel.findByIdAndUpdate(id,{email:userObj._email, pseudo:userObj._pseudo, password:userObj._password, role:userObj._role}).exec();
        return userObj;
    }

    static async deleteUserOnDatabase(id) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        await userModel.deleteOne({ _id: id }).exec();
        return "Deleted user";
    }

    static async callbackCreateUser(req,res) {
        const userParams = req.body;
        const createUser = await user.createUserOnDatabase(userParams.email,userParams.pseudo,userParams.password,userParams.role);
        res.status(200);
        res.send('Created user on database :' + createUser);
    }

    static async callbackGetUserById(req,res) {
        const getId = req.params.id;
        const getUser = await user.getUserOnDatabaseById(getId);
        res.status(200);
        res.send(getUser);
    }

    static async callbackGetUserByName(req,res) {
        const getName = req.params.name;
        const getUser = await user.getUserOnDatabaseByName(getName);
        res.status(200);
        res.send(getUser);
    }

    static async callbackUpdateUser (req, res) {
        const userParams = req.body;
        const userObj = new user(userParams.email,userParams.pseudo,userParams.password,userParams.role);
        const updateUser = await user.updateUserOnDatabase(userParams.id,userObj);
        res.status(200);
        res.send(updateUser);
    }
    
    static async callbackDeleteUser (req, res) {
        const reqParams = req.body;
        const deleteUser = await user.deleteUserOnDatabase(reqParams.id);
        res.status(200);
        res.send(deleteUser);
    }
}