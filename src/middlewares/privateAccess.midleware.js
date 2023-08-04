function privateAccess(req, res, next) {
    // console.log(req);
    if (!req.cookies) return res.redirect('/login')

    next()
}

module.exports = privateAccess