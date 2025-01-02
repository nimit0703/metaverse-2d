import { Router } from "express";

import client from "@repo/db/client";
// const client = require("@repo/db/client");

import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import { signin, signup } from "../../controllers/authController";

export const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/elements", async (req, res) => {
  const elements = await client.element.findMany();
  res.json({
    elements: elements.map((e) => ({
      id: e.id,
		   imageUrl: e.imageUrl,
		   width: e.width,
		   height: e.height,
		   static: e.static
    })),
  });
});
router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();
  res.json({
    avatars: avatars.map((a) => ({
      id: a.id,
      name: a.name,
      imageUrl: a.imageUrl,
    })),
  });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
