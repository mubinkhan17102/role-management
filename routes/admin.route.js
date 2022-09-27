const router = require('express').Router();

router.get('/users', async (req, res, next)=>{
    res.render('manage-user');
})

module.exports = router;