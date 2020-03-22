function isUser(req, res, next) {
    // const token = req.header('auth-token');
    // console.log(token);
    
    if(!req.user) {
        req.flash('error_msg', 'No se encuentra usuario')
        return res.status(401).redirect('/login')
    }
    next()
}

module.exports = isUser