import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
const generateToken = (userId: string, role: Role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export default generateToken;
