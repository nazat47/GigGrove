import { PrismaClient } from "@prisma/client";
import { BadRequest, NotFound } from "../errors/index.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/createToken.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const prisma = new PrismaClient();
  if (!email || !password) {
    throw new BadRequest("Please insert email and password");
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });
  const token = createToken(email, user.id);
  return res
    .status(201)
    .json({ user: { id: user.id, email: user.email }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const prisma = new PrismaClient();
  if (!email || !password) {
    throw new BadRequest("Please insert email and password");
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new NotFound("User not found");
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new BadRequest("Password incorrect");
  }
  const token = createToken(email, user.id);
  return res
    .status(201)
    .json({ user: { id: user.id, email: user.email }, token });
};
