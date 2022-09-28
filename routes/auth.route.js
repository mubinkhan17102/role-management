const router = require('express').Router();
const userModel = require('../models/user.model')
const {body, validationResult} = require('express-validator');
const passport = require('passport');

router.get('/login', async (req, res, next)=>{
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get('/register', async (req, res, next)=>{
    req.flash('error', 'Something wrong');
    res.render('register')
})

router.post('/register', [
        body('email').trim().isEmail().withMessage('Email must be a valid email')
        .normalizeEmail().toLowerCase(),
        body('password').trim().isLength(2).withMessage('Password length short, min 3 char require'),
        body('password2').custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error('Password not match')
            }
            return true;
        })
    ],
    async (req, res, next)=>{
    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            errors.array().forEach(error=>{
                req.flash('error', error.msg);
            })

            return res.render('register', {email:req.body.email ,messages: req.flash()})
        }

        const {email} = req.body;
        const isEmailExist = await userModel.exists({email: req.body.email})
        
        if(isEmailExist){
            req.flash('email', email)
            return res.render('register');
        }

        const newUser = new userModel(req.body);
        await newUser.save();

        req.flash('success', `${user.email} registered successfully`)
        res.redirect('/auth/login');

    }catch(e){
        next(e);
    }
})

router.get('/logout', async (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        return res.redirect('/auth/login')
    });
})

module.exports = router;
