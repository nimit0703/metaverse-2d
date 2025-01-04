import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import {
  createAvatar,
  createElement,
  createMap,
  updateElement,
} from "../../controllers/adminController";

export const adminRouter = Router();
adminRouter.use(adminMiddleware);
adminRouter.post("/element", createElement);
adminRouter.put("/element/:elementId", updateElement);
adminRouter.post("/avatar", createAvatar);
adminRouter.post("/map", createMap);
