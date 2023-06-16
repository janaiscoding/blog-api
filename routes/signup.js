const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Get request for signup')
});
router.post('/', (req,res, next)=>{
    res.send('POST ON SIGNUP')
})

module.exports = router;
