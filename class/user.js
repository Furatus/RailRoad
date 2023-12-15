import mongoose from "mongoose";
import jwt from "jsonwebtoken";


export class user {

    //on definit le schema mongose (statique) pour le reutiliser dans notre classe
    static userSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        email: String,
        pseudo: String,
        password: String,
        role: String
    }, { collection: 'users' })

    static createUserSchema = new mongoose.Schema({
        email: String,
        pseudo: String,
        password: String,
        role: String
    }, { collection: 'users' })

    // constructeur
    constructor(email, pseudo, password, role) {
        this._email = email;
        this._pseudo = pseudo;
        this._password = password;
        this._role = role;
    }

    // toutes les methodes se structurent assez similairement
    // a savoir d'abord se connecter a la base pour ensuite envoyer des query dessus
    //methode pour creer un utilisateur sur la database
    static async createUserOnDatabase(email,pseudo,password) {
        const checkIfExists = await this.getUserOnDatabaseByName(pseudo);
        if (checkIfExists) return false;

        await mongoose.connect(process.env.MONGO_ADDRESS);

        const pushUser = mongoose.model("userCreate",this.createUserSchema);
        const defaultRole = "user";
        const sendUser = new pushUser({
            email: email,
            pseudo: pseudo,
            password: password,
            role: defaultRole
        });
        await sendUser.save();
        return true;
    }

    //methode fetch utilisateur sur la db uniquement par id
    static async getUserOnDatabaseById(id) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
    const userModel = mongoose.model("user", this.userSchema);
    const user = await userModel.findOne({_id:id}).exec();
    return user;
    }

    // meme methode mais avec un nom
    static async getUserOnDatabaseByName(name) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        const user = await userModel.findOne({pseudo:name}).exec();
        return user;
    }

    // mise a jour de l'utilisateur sur la base de donnees, pour l'instant on remplace l'utilisateur entier sur la base a chaque modif
    static async updateUserOnDatabase(id,userObj) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        await userModel.findByIdAndUpdate(id,{email:userObj._email, pseudo:userObj._pseudo, password:userObj._password, role:userObj._role}).exec();
        return userObj;
    }

    // supprimer un utilisateur en utilisant son id
    static async deleteUserOnDatabase(id) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
        const userModel = mongoose.model("user", this.userSchema);
        await userModel.deleteOne({ _id: id }).exec();
        return "Deleted user";
    }

    // callbacks ici, on gere les requêtes pour toutes les routes (simplement recuperer les donnes de la requete et les envoyer dans une methode correspondante)
    static async callbackCreateUser(req,res) {
        try {
        const userParams = req.body;
        const createUser = await user.createUserOnDatabase(userParams.email,userParams.pseudo,userParams.password);
        if(!createUser) res.status(404).send("404 - User not found");
        if (createUser == false) return res.status(409).send("409 - Conflict\nUser already exists")
        res.status(200);
        res.send('Created user on database ' + createUser);
        } catch(error) {
            return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackGetUserById(req,res) {
        try {
        if (req.user.isValid === false) throw new error
        const getId = req.params.id;
        const getUser = await user.getUserOnDatabaseById(getId);
        if(!getUser) res.status(404).send("404 - User not found");
        res.status(200);
        res.send(getUser);
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackGetUserByName(req,res) {
        try {
        if (req.user.isValid === false) throw new error;
        const getName = req.params.name;
        const getUser = await user.getUserOnDatabaseByName(getName);
        if(!getUser) res.status(404).send("404 - User not found");
        res.status(200);
        res.send(getUser);
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    }

    static async callbackUpdateUser (req, res) {
        try {
        const userParams = req.body;
        const userObj = new user(userParams.email,userParams.pseudo,userParams.password,userParams.role);
        const updateUser = await user.updateUserOnDatabase(userParams.id,userObj);
        if(!updateUser) res.status(404).send("404 - User not found");
        res.status(200);
        res.send(updateUser);
        } catch(error) {
            return res.status(500).send("Internal Server Error");
        }
    }
    
    static async callbackDeleteUser (req, res) {
        try {
        if (req.user.isValid === false) throw new error
        const reqParams = req.body;
        const deleteUser = await user.deleteUserOnDatabase(reqParams.id);
        if(!deleteUser) res.status(404).send("404 - User not found");
        res.status(200);
        res.send(deleteUser);
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    }
    static async callbackLogin(req, res) {
        try{
        const username = req.body.username;
        const password = req.body.password;
        if (username === undefined || username === "" || username === null) {
            return res.status(401).send("401 - Unauthorized \nusername or password incorrect");
        }
        const databaseUser = await user.getUserOnDatabaseByName(username);
        if (!databaseUser) return res.status(401).send("401 - Unauthorized \nusername or password incorrect");
        if (databaseUser.password === password) {
            const token = jwt.sign({ _id: databaseUser._id },process.env.PASSPHRASE_TOKEN,{expiresIn : "1d"});
            res.status(200);
            res.json(token);
        }
        else {
            res.status(401).send("401 - Unauthorized \nusername or password incorrect");
        }
    }
    catch (error) {
        return res.status(500).send("500 - Internal server error");
    }
    }
}