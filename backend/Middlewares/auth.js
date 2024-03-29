const jwt = require('jsonwebtoken');

function auth( req , res , next ) {
    try {
        const token = req.header('x-auth-token')    
        if(!token) return res.status(401).json({msg:"No token privided !!"})
        const decoded = jwt.verify( token , process.env.SECRET_KEY )
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({msg:"Token invalid"})
    }
}

module.exports = auth;