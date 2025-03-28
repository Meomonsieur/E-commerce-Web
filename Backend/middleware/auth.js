const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        console.log("chay vao day")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Không có token hoặc token không hợp lệ!" });
        }

        const token = authHeader.split(" ")[1];


        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {

            return res.status(500).json({ message: "Lỗi server: JWT_SECRET chưa được cấu hình!" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ!" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

module.exports = protect;
