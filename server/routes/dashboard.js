import express from "express";
import { getSellerData } from "../controllers/dashboard.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();

router.get("/seller", authenticateUser, getSellerData);

export default router;
