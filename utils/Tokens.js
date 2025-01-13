import jwt from "jsonwebtoken";

export function generateToken(userData) {
  return jwt.sign(userData, process.env.SECRET_KEY_JWT, { expiresIn: "3d" });
}
export function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid" });
  }
  
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
