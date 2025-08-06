import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "10y" }
    );
    return token;
  } catch (error) {
    throw new Error("Error during JWT token generation: " + error.message);
  }
};

export default genToken;
