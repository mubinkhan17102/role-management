const router = require('express').Router();


router.get('/profile', (req, res, next)=>{
    res.render('profile')
})

router.get('/users', async(req, res, next)=>{
    res.render('manege-user');
})

module.exports = router;
