module.exports = function isASeller(req, res, next){
    if(req.isAuthenticated() && req.user.role ==='seller')
    {
        return next();
    }
    res.redirect('/login');
};