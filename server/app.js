dotenv.config();
import "express-async-errors";
import dotenv from "dotenv";
import { routeNotFound } from "./middlewares/notFound.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import gigRouter from "./routes/gigs.js";
import orderRouter from "./routes/order.js";
import messageRouter from "./routes/messages.js";
import dashboardRouter from "./routes/dashboard.js";

import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: [process.env.PUBLIC_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/gigs", gigRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads", express.static("uploads"));

app.use(routeNotFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
