const jwt = require("jsonwebtoken")

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token)
        return res.status(401).json({message: "Access Denied. No Token Provided"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser = decoded;
        next();
    }
    catch(error){
        res.status(401).json({message: "Expired Token"})
    }
}

module.exports = authenticateUser;
