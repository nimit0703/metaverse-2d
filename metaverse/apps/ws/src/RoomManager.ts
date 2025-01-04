import { outgoingMessage } from "./type";
import type { User } from "./User";
import { WebSocket } from "ws";
export class RoomManager {
  rooms: Map<string, User[]> = new Map();
  static instance: RoomManager;
  constructor() {
    this.rooms = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }
  removeUser(user: User, spaceId: string) {
    if (!this.rooms.has(spaceId)) {
      return;
    }
    this.rooms.set(
      spaceId,
      this.rooms.get(spaceId)!.filter((x) => x !== user)
    );
  }

  addUser(user: User, spaceId: string) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, []);
    }
    this.rooms.set(spaceId, [...this.rooms.get(spaceId)!, user]);
  }

  broadcastMessage(user: User, spaceId: string, message: outgoingMessage) {
    if (!this.rooms.has(spaceId)) {
      return;
    }
    this.rooms.get(spaceId)!.forEach((x) => {
      if (x.id !== user.id) {
        x.sendMessage(message);
      }
    });
  }
}
