import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);

      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};
