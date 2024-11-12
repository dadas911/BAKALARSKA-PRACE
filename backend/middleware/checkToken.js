import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res
            .status(401)
            .json({ message: "Přístup zamítnut - nebyl poskytnut token" });
    }

    try {
        const token = authHeader.replace("Bearer ", "");

        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decodedUser;

        next();
    } catch (error) {
        console.log("Neplatný token");
        res.status(403).json({ message: "Neplatný token" });
    }
};

export default checkToken;
