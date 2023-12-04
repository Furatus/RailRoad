//import user from './routes/user.route.js';
import trainstationRouter from './routes/trainstation.route.js';
import bodyParser from "body-parser";
//import train from './routes/train.route.js';
import express from 'express';
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());

//app.use("api/user",user)
app.use("/api/trainstation",trainstationRouter)
//app.use("api/train",train)

const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
