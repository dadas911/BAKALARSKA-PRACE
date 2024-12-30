import jwt from "jsonwebtoken";

//Middleware function that will check "authoriation" header in request for token
const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    //No authorization header -> deny access
    if (!authHeader) {
        return res
            .status(401)
            .json({ message: "Přístup zamítnut - nebyl poskytnut token" });
    }

    //Get token and verify it
    try {
        const token = authHeader.replace("Bearer ", "");
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        //Add user._id to request message for some handler functions
        req.user = decodedUser;

        //Calling "next" function
        next();
    } catch (error) {
        console.log("Neplatný token");
        res.status(403).json({ message: "Neplatný token" });
    }
};

export default checkToken;
