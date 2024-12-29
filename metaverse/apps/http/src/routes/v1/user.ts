import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  console.log("req",req.body);
  const parsedData = UpdateMetadataSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  console.log("req", req.userId);
  console.log("data", parsedData.data);
  
  const updatedUser = await client.user.update({
    where: { id: req.userId },
    data: { avatarId: parsedData.data.avatarId },
  });
  console.log(updatedUser);
  
  res.json({ message: "metadata updated successfully" });
});
userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdsString = (req.query.ids ?? "[]") as string;
  let userIds = userIdsString.slice(1, userIdsString.length - 1).split(",");

  const metadata = await client.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      avatar: true,
    },
  });
  res.json({
    avatars: metadata.map((m: any) => ({
      userId: m.id,
      imageUrl: m.avatar?.imageUrl,
    })),
  });
});
