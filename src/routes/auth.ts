import express from "express";
import { upload } from "../utility/utility";
import { registerUser, signIn } from "../controllers/auth";

const router = express.Router();

router.post("/register", upload.single("picture"), registerUser);
router.post("/login", signIn);

export default router;
