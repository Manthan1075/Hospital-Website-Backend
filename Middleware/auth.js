import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Verify JWT
        req.email = decoded.email; // Attach email to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};
