const router = require('express').Router();

router.get('/', (req, res, next)=>{
    req.send(`Hello world`)
})

module.exports = router;
