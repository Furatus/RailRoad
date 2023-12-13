import userRouter from './routes/user.route.js';
import trainstationRouter from './routes/trainstation.route.js';
import trainRouter from './routes/train.route.js';
import bodyParser from "body-parser";
import express from 'express';
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());

app.use("/api/user",userRouter)
app.use("/api/trainstation",trainstationRouter)
app.use("/api/train",trainRouter)

const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
