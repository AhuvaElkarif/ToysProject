const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

exports.authToken = async (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json("You must send token");
    }

    try {
        let decodeToken = jwt.verify(token, config.tokenSecretDb);
        req.tokenData=decodeToken;
        // אם הכל בסדר תעבור לפונקציה הבאה
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token invalid or expired" });
    }
}