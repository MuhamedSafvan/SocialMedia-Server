import express from "express";
import { validateUser } from "../utility/utility";
import { getUser, getUserFriends, updateUserFriends } from "../controllers/user";

const router = express.Router();

router.get("/", validateUser, getUser);
router.get("/friends", validateUser, getUserFriends);
router.patch("/friends/:id", validateUser, updateUserFriends);

export default router;
