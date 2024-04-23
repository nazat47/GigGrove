import express from "express";
import {
  addMessage,
  getMessags,
  getUnreadMsgs,
  markAsRead,
} from "../controllers/messages.js";
import { authenticateUser } from "../middlewares/authentication.js";
const router = express.Router();

router.get("/get/:orderId", authenticateUser, getMessags);
router.post("/add/:orderId", authenticateUser, addMessage);
router.get("/unread-messages", authenticateUser, getUnreadMsgs);
router.put("/mark-read/:messageId", authenticateUser, markAsRead);

export default router;
