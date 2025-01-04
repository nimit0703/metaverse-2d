import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import {
  getBulkMetadata,
  updateUserMetadata,
} from "../../controllers/userController";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, updateUserMetadata);
userRouter.get("/metadata/bulk", getBulkMetadata);
