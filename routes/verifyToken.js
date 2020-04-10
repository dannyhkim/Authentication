const jwt = require('jsonwebtoken');

// Middleware function
module.exports = function (req, res, next){
    const token = req.header('auth-token'); // checks if it has auth-token
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); // returns id
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid token');
    }
}
