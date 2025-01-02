import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { createElement, updateElement } from "../../controllers/adminController";

export const adminRouter = Router();
adminRouter.post("/elememt", adminMiddleware, createElement);
adminRouter.put("/element/:elementId",adminMiddleware, updateElement);
adminRouter.get("/:avatar", (req, res) => {});
adminRouter.get("/map", (req, res) => {});
