import client from "@repo/db/client";
import { Request, Response } from "express";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../types";

export const createElement = async (req: Request, res: Response) => {
  const parsedData = CreateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const element = await client.element.create({
    data: {
      imageUrl: parsedData.data.imageUrl,
      width: parsedData.data.width,
      height: parsedData.data.height,
      static: parsedData.data.static,
    },
  });
  res.json({ id: element.id });
};
export const updateElement = async (req: Request, res: Response) => {
  const parsedData = UpdateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }

  const elementId = req.params.elementId;
  const element = await client.element.findUnique({
    where: { id: elementId },
  });
  if (!element) {
    res.status(404).json({ message: "Element not found" });
    return;
  }
  await client.element.update({
    where: { id: elementId },
    data: { imageUrl: parsedData.data.imageUrl },
  });
  res.json({ message: "Element updated successfully" });
};
export const createAvatar = async (req: Request, res: Response) => {
  const parsedData = CreateAvatarSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const avatar = await client.avatar.create({
    data: {
      imageUrl: parsedData.data.imageUrl,
      name: parsedData.data.name,
    },
  });
  
  res.json({ avatarId: avatar.id });
};
export const createMap = async (req: Request, res: Response) => {
  const parsedData = CreateMapSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const map = await client.map.create({
    data: {
      name: parsedData.data.name,
      thumbnail: parsedData.data.thumbnail,
      width: parseInt(parsedData.data.dimensions.split("x")[0]),
      height: parseInt(parsedData.data.dimensions.split("x")[1]),
      mapElements: {
        create: parsedData.data.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });
  res.json({ id: map.id });
};
