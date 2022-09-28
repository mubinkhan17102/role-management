const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local')
require('dotenv').config();

const app = express();
app.use(session({
    secret: 'mubin',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.messages = req.flash();
    next();
});
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./util/passport.auth');

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Mongo conntected')).catch(e=>console.log(e.message))

app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));
app.use('/admin', require('./routes/admin.route'));

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
    console.log(`App run on http://localhost:${PORT}`);
})