const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(morgan('dev'))

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Mongo conntected')).catch(e=>console.log(e.message))

app.use('/', require('./routes/index.route'));

app.use((req, res, next)=>{
    next(createHttpError.NotFound());
})

app.use((err, req, res, next)=>{
    err.status = err.status || 500;
    res.status(err.status);
    res.send(err);
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`App run on http://localhost:${PORT}`)
})