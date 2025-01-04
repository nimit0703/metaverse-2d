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
spaceRouter.use(userMiddleware);

spaceRouter.post("/", createSpace);
spaceRouter.get("/all", getAllSpaces);
spaceRouter.delete("/element", deleteElementFromSpace);
spaceRouter.post("/element", addElementToSpace);
spaceRouter.get("/:spaceId", findSpace);
spaceRouter.delete("/:spaceId", deleteSpace);
