const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ msg: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_ADMIN_SECRET);

        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
};

module.exports = {
    adminMiddleware : adminMiddleware
};