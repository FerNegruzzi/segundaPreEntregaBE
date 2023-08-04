function publicAccess(req, res, next) {
    if (req.cookies) return res.redirect('/')

    next()
}

module.exports = publicAccess