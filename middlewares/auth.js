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

    exports.authAdmin = (req,res,next) => {
        let token = req.header("x-api-key");

        if(!token){
          return res.status(401).json({msg:"You need to send token to this endpoint url"})
        }

        try{
          let decodeToken = jwt.verify(token,config.tokenSecretDb);
          // check if the role in the token of admin
          if(decodeToken.role != "admin"){
            return res.status(401).json({msg:"Token invalid or expired, code: 43"})
          }
         
          // add to req , so the next function will recognize
          // the tokenData/decodeToken
          req.tokenData = decodeToken;
      
          next();
        }
        catch(err){
          console.log(err);
          return res.status(401).json({msg:"Token invalid or expired, log in again "})
        }
}