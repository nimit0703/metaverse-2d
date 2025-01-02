import client from "@repo/db/client";
import { Request, Response } from "express";
import {
  AddElementSchema,
  createSpaceSchema,
  DeleteElementSchema,
} from "../types";

export const createSpace = async (req: Request, res: Response) => {
  const parsedData = createSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  if (!parsedData.data.mapId) {
    const newSpace = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]),
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        creatorId: req.userId!,
      },
    });
    res.json({ spaceId: newSpace.id });
    return;
  }

  const map = await client.map.findFirst({
    where: { id: parsedData.data.mapId },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });
  if (!map) {
    res.status(404).json({ message: "Map not found" });
    return;
  }
  const space = await client.$transaction(async () => {
    const newSpace = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId!,
      },
    });
    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        elementId: e.elementId,
        spaceId: newSpace.id,
        x: e.x!,
        y: e.y!,
      })),
    });
    return newSpace;
  });
  res.json({ spaceId: space.id });
  return;
};
export const findSpace = async (req: Request, res: Response) => {
  const space = await client.space.findUnique({
    where: { id: req.params.spaceId },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });
  if (!space) {
    res.status(404).json({ message: "Space not found" });
    return;
  }

  res.json({
    dimensions: `$${space.width}x${space.height}`,
    elements: space.elements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
      },
      x: e.x,
      y: e.y,
    })),
  });
};
export const deleteSpace = async (req: Request, res: Response) => {
  const space = await client.space.findUnique({
    where: { id: req.params.spaceId },
    select: { creatorId: true },
  });
  if (!space) {
    res.status(404).json({ message: "Space not found" });
    return;
  }

  if (space.creatorId !== req.userId) {
    console.log("code should reach here");
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  await client.space.delete({ where: { id: req.params.spaceId } });

  res.json({ message: "Space deleted successfully" });
};
export const getAllSpaces = async (req: Request, res: Response) => {
  const spaces = await client.space.findMany({
    where: { creatorId: req.userId },
  });
  res.json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    })),
  });
};
export const addElementToSpace = async (req: Request, res: Response) => {
  const parsedData = AddElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }

  const space = await client.space.findUnique({
    where: { id: parsedData.data.spaceId, creatorId: req.userId },
    select: {
      width: true,
      height: true,
    },
  });
  if (!space) {
    res.status(404).json({ message: "Space not found" });
    return;
  }
  if (
    parsedData.data.x < 0 ||
    parsedData.data.y < 0 ||
    parsedData.data.x > space.width ||
    parsedData.data.y > space.height
  ) {
    res.status(400).json({ message: "Point is outside of the boundary" });
    return;
  }

  await client.spaceElements.create({
    data: {
      elementId: parsedData.data.elementId,
      spaceId: parsedData.data.spaceId,
      x: parsedData.data.x,
      y: parsedData.data.y,
    },
  });
  res.json({ message: "Element added successfully" });
};

export const deleteElementFromSpace = async (req: Request, res: Response) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const spaceElement = await client.spaceElements.findFirst({
    where: { id: parsedData.data.id },
    include: {
      space: true,
    },
  });

  if (
    !spaceElement?.space.creatorId ||
    spaceElement.space.creatorId !== req.userId
  ) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await client.spaceElements.delete({ where: { id: parsedData.data.id } });
  res.json({ message: "Element deleted successfully" });
};
