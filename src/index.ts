import express, { Request, Response } from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectToMongoDB from "./helpers/dbConnection";
import { users, posts } from "./data/index";
import { UserModel } from "./models/user";
import { PostModel } from "./models/post";

/* CONFIGURATIONS */

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//Routes
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import postRoute from "./routes/post";
import apiErrorHandler from "./err/api-error-handler";
import logger from "./logger";
connectToMongoDB();

//API Routes
app.use("/api/auth/", authRoute);
app.use("/api/user/", userRoute);
app.use("/api/posts/", postRoute);

// Error handling middleware
app.use(apiErrorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port ${port}`);
  // UserModel.insertMany(users);
  // PostModel.insertMany(posts);
});

//Handle Promise Rejection
process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", function (err) {
  logger.error(new Date().toUTCString() + " uncaughtException:", err);
  logger.error(err.stack);
  process.exit(1);
});
