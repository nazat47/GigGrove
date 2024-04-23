import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { confirmOrder, createOrder, getBuyerOrders, getSellerOrders } from "../controllers/order.js";
const router = express.Router();

router.post("/create", authenticateUser, createOrder);
router.post("/confirm", authenticateUser, confirmOrder);
router.get("/get-buyer-orders", authenticateUser, getBuyerOrders);
router.get("/get-seller-orders", authenticateUser, getSellerOrders);

export default router;
