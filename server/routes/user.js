import express from "express";
import { getUserInfo, setUserImage, setUserInfo } from "../controllers/user.js";
import { authenticateUser } from "../middlewares/authentication.js";
const router = express.Router();
import multer from "multer";

const upload = multer({ dest: "uploads/profile/" });

router.get("/get-user", authenticateUser, getUserInfo);
router.post("/set-user", authenticateUser, setUserInfo);
router.post(
  "/set-user-image",
  authenticateUser,
  upload.single("image"),
  setUserImage
);

export default router;
