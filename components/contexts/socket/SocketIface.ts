import { Socket } from "socket.io-client";

import { RoomMembersIface } from "./RoomMembersIface";
import { TextIface } from "../../../shared/TextIface";

export interface SocketIface {
  // current: SocketIOClient.Socket;
  readonly socket: typeof Socket;
  readonly roomId: string;
  readonly roomMembers: RoomMembersIface;
  readonly textLogs: TextIface[];
  join(roomId: string): void;
  leave(): void;
  text(message: string): void;
}
