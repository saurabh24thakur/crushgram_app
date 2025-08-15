import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({ message: "Token not found!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export default isAuth;
