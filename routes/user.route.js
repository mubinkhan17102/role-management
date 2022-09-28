const router = require('express').Router();


router.get('/profile', (req, res, next)=>{
    const person = req.user;
    console.log(person)
    res.render('profile', {person})
})

router.get('/users', async(req, res, next)=>{
    res.render('manege-user');
})

module.exports = router;
