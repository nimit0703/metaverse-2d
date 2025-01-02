import { Router } from "express";
import {
  createSpace,
  findSpace,
  deleteSpace,
  getAllSpaces,
  addElementToSpace,
  deleteElementFromSpace,
} from "../../controllers/spaceController";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", createSpace);
spaceRouter.get("/:spaceId", findSpace);
spaceRouter.delete("/:spaceId", userMiddleware, deleteSpace);
spaceRouter.get("/all", userMiddleware, getAllSpaces);
spaceRouter.post("/element", userMiddleware, addElementToSpace);
spaceRouter.delete("/element", userMiddleware, deleteElementFromSpace);
