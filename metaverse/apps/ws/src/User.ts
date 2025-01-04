import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

import client from "@repo/db/client";

import { JWT_PASSWORD } from "./config";
import { outgoingMessage } from "./type";
import { RoomManager } from "./RoomManager";

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
export class User {
  public userId?: string;
  public id: string;

  private spaceId?: string;
  private x: number;
  private y: number;

  private ws: WebSocket;

  constructor(private user_ws: WebSocket) {
    this.ws = user_ws;
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.initHandlers();
  }
  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      console.log(parsedData);
      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          // check if token is valid using jwt
          const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
          if (!userId) {
            console.log("invalid token");
            this.ws.close();
            return;
          }
          this.userId = userId;
          // check if space exists
          const space = await client.space.findFirst({
            where: {
              id: spaceId,
            },
          });
          if (!space) {
            console.log("space not found");
            this.ws.close();
            return;
          }
          this.spaceId = spaceId;

          console.log("user is aready to join room", spaceId, userId);
          console.log("id", this.id);
          console.log("userId", this.userId);

          // add user to room
          RoomManager.getInstance().addUser(this, spaceId);
          this.x = Math.floor(Math.random() * space?.width);
          this.y = Math.floor(Math.random() * space?.height);

          // send user space join message
          this.sendMessage({
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
              users:
                RoomManager.getInstance()
                  .rooms.get(spaceId)
                  ?.filter((x) => x.id !== this.id)
                  ?.map((u) => ({ id: u.id })) ?? [],
            },
          });

          // broadcast user joined message
          RoomManager.getInstance().broadcastMessage(this, spaceId, {
            type: "user-joined",
            payload: {
              userId: this.id,
              x: this.x,
              y: this.y,
            },
          });

          break;
        case "move":
          if (!this.spaceId) {
            console.log("user not in space");
            return;
          }
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          const displaceX = Math.abs(moveX - this.x);
          const displaceY = Math.abs(moveY - this.y);
          if (
            (displaceX == 1 && displaceY == 0) ||
            (displaceX == 0 && displaceY == 1)
          ) {
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcastMessage(this, this.spaceId, {
              type: "movement",
              payload: {
                x: this.x,
                y: this.y,
              },
            });
            return;
          }
          console.log("invalid movement");
          this.sendMessage({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });
          break;
        default:
          console.log("unknown message type");
          break;
      }
    });
  }

  sendMessage(payload: outgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }

  destroy() {
    RoomManager.getInstance().broadcastMessage(this, this.spaceId!, {
      type: "user-left",
      payload: {
        userId: this.userId,
      },
    });
    RoomManager.getInstance().removeUser(this, this.spaceId!);
  }
}
