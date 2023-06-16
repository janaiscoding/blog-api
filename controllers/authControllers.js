
module.exports.signup_get = (req, res) =>{
    res.render('signup')
}

module.exports.login_get = (req,res)=>{
    res.render('login')
}
module.exports.signup_post = (req,res)=>{
    res.send('new post for: signup')
}
module.exports.login_post = (req,res)=>{
    res.send('new post for: login')
}