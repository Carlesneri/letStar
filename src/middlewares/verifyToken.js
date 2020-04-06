function isUser(req, res, next) {
    if(!req.user) {
        req.flash('error_msg', 'No se encuentra usuario')
        return res.status(401).redirect('/login')
    }
    next()
}

module.exports = isUser