import express from "express";
import { upload, validateUser } from "../utility/utility";
import { createPost, getPosts, likePost } from "../controllers/post";

const router = express.Router();

router.post("/", upload.single("picture"), validateUser, createPost);
router.get("/", getPosts);
router.patch("/:postId/like", validateUser, likePost);

export default router;
