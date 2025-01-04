import { Request, Response, Router } from "express";
import client from "@repo/db/client";
import { UpdateMetadataSchema } from "../types";
export const userRouter = Router();

export const updateUserMetadata = async (req: Request, res: Response) => {
  const parsedData = UpdateMetadataSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  try {
    const updatedUser = await client.user.update({
      where: { id: req.userId },
      data: { avatarId: parsedData.data.avatarId },
    });
    res.json({ message: "metadata updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
};

export const getBulkMetadata = async (req: Request, res: Response) => {
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
};
