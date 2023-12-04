import user from './user.js';
import trainstation from './trainstation.js';
import train from './train.js';
import express from 'express';

const app = express();
app.use("api/user",user)
app.use("api/trainstation",trainstation)
app.use("api/train",train)