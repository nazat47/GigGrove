import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
const router = express.Router();
import multer from "multer";
import {
  AddReview,
  checkGigOrder,
  createGig,
  getGigsData,
  getGigsDataUser,
  getUserGigs,
  searchGig,
  updateGig,
} from "../controllers/gigs.js";

const upload = multer({ dest: "uploads/" });

router.post("/create", authenticateUser, upload.array("images"), createGig);
router.get("/get", authenticateUser, getUserGigs);
router.get("/getDetails/:gigId", authenticateUser, getGigsData);
router.get("/getDetailsUser/:gigId", getGigsDataUser);
router.put("/edit/:gigId", authenticateUser, upload.array("images"), updateGig);
router.get("/search", searchGig);
router.get("/check-order/:gigId", authenticateUser, checkGigOrder);
router.post("/add-review/:gigId", authenticateUser, AddReview);

export default router;
