import {config} from './config/dbConfig.js'
import express from 'express';
import logger from 'morgan';
import mongooseDef from 'mongoose';
const mongoose = mongooseDef.default;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger("short"));

mongoose.connect(config.database, config.connectOptions);
mongoose.connection.on('connected', () => console.log('Connected to database '+config.database));
mongoose.connection.on('error', () => {console.log('Database error');});

import queue from './route/queueRoute.js';
app.use('/api/queue',queue)

import store from './route/storeRoute.js';
app.use('/api/store',store)

import timeslot from './route/timeslotRoute.js'
app.use('/api/timeslot',timeslot)
app.use('*',(req,res)=>{
    res.status(400).json({error:"There are no path that you want"})
})

app.listen(4000,()=> console.log("server listening at port 4000!!!"));