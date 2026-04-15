const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, "12345"); // In production, use process.env.JWT_SECRET
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role ? req.user.role.toLowerCase() : "";
        if (!roles.includes(userRole)) {
            return res.status(403).json({ msg: "Access denied: insufficient permissions" });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
