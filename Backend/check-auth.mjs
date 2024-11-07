import jwt from "jsonwebtoken";

const checkauth=(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "this_secret_should_be_longer_than_it_is");
       // jwt.verify(token, process.env.JWT_KEY);
       // req.userData = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Authentication failed, invalid token"
        });
    }
};

export default checkauth;