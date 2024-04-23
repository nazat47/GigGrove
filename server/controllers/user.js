import { PrismaClient } from "@prisma/client";
import {
  BadRequest,
  NotFound,
  Unauthenticated,
  Unauthorized,
} from "../errors/index.js";
import { renameSync } from "fs";

export const getUserInfo = async (req, res) => {
  const prisma = new PrismaClient();
  if (!req.userId) {
    throw new NotFound("User not found");
  }
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    throw new NotFound("User not found");
  }
  const { password: pass, ...rest } = user;
  return res.status(200).json(rest);
};
export const setUserInfo = async (req, res) => {
  const { username, fullName, description } = req.body;
  const prisma = new PrismaClient();
  if (!req.userId) {
    throw new NotFound("User not found");
  }
  if (!username || !description || !fullName) {
    throw new BadRequest("Please insert all the fields");
  }
  // const usernameExist = await prisma.user.findUnique({ where: { username } });
  // if (usernameExist) {
  //   return res.status(400).json({ userError: true });
  // }
  const userUpdate = await prisma.user.update({
    where: { id: req.userId },
    data: {
      username,
      fullName,
      description,
      isProfileInfoSet: true,
    },
  });
  if (!userUpdate) {
    throw new BadRequest("Something went wrong");
  }

  return res.status(200).json({ msg: "User updated" });
};
export const setUserImage = async (req, res) => {
  const prisma = new PrismaClient();
  if (!req.file) {
    throw new BadRequest("Image is not uploaded");
  }
  if (!req.userId) {
    throw new Unauthorized("User not authorized");
  }
  const date = Date.now();
  let filename = "uploads/profile/" + date + req.file.originalname;
  renameSync(req.file.path, filename);
  await prisma.user.update({
    where: { id: req.userId },
    data: {
      profileImage: filename,
    },
  });
  return res.status(200).json({ img: filename });
};
