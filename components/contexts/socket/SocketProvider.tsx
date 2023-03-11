import { FC, useState, useEffect, useCallback, useContext } from "react";
import SocketIO, { Socket } from "socket.io-client";

import UserProfileContext from "../profile/UserProfileContext";
import { UserProfileIface } from "../../../shared/UserProfileIface";
import { TextIface } from "../../../shared/TextIface";

import SocketContext from "./SocketContext";
import { SocketIface } from "./SocketIface";
import { RoomMembersIface } from "./RoomMembersIface";
import { RoomMembersList } from "../../rooms/RoomMembersList";

const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket>(null);
  const [roomId, setRoomId] = useState<string>(null);
  const [admin, setadmin] = useState<Object>(null);
  const myProfile = useContext(UserProfileContext);
  const [roomMembers, setRoomMembers] = useState<RoomMembersIface>(null);
  const [textLogs, setTextLogs] = useState<TextIface[]>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("[mounted]");

    // connect to Socket.io server
    const s = SocketIO();
    setSocket(s);

    // initialize state
    setRoomMembers({});
    setTextLogs([]);

    return () => {
      console.log("[unmounted]");
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !myProfile) return;

    /**
     * connection lost
     */
    function disconnect() {
      console.log("[received] disconnect");
      setSocket(null);

      socket.once("reconnect", () => {
        console.log("[reconnected]");
        setSocket(socket);
        setRoomMembers({});
        join(roomId);
      });
    }

    /**
     * somebody joined this session and said hello
     * @param profile
     * @param socketId
     */
    function hello(profile: UserProfileIface, socketId: string) {
      console.log("[received] hello from socket provider", profile, "from", socketId);
      const cs = Object.assign({}, roomMembers);
      cs[socketId] = {
        profile,
      };
      if(profile.name=="admin"||admin==null){
        setadmin(profile);
      }
      console.log("checking admin profile ",admin);
      setRoomMembers(cs);
      socket.emit("hello-ack", roomId, myProfile);
      // console.log(RoomMembersList);
    }
    
    /**
     * somebody responded to my greeting
     * @param profile somebody
     * @param socketId somebody's socket id
     */
    function helloAck(profile: UserProfileIface, socketId: string) {
      console.log("[received] hello-ack", profile, "from", socketId);
      const cs = Object.assign({}, roomMembers);
      cs[socketId] = {
        profile,
      };
      setRoomMembers(cs);
    }

    /**
     * somebody is leaving this session
     * @param socketId somebody's socket id
     */
    function bye(socketId: string) {
      console.log(
        "[received] bye from",
        socketId,
        "exists?",
        !!roomMembers[socketId]
      );
      if (roomMembers[socketId]) {
        const cs = Object.assign({}, roomMembers);
        delete cs[socketId];
        setRoomMembers(cs);
      }
    }

    socket.on("disconnect", disconnect);
    socket.on("hello", hello);
    socket.on("hello-ack", helloAck);
    socket.on("bye", bye);

    return () => {
      socket.off("hello", hello);
      socket.off("hello-ack", helloAck);
      socket.off("bye", bye);
    };
  }, [socket, myProfile, roomId, roomMembers]);

  useEffect(() => {
    if (!socket) return;

    /**
     * somebody sent a message
     */
    function text(data: TextIface) {
      const logs = textLogs.slice();
      logs.push(data);
      setTextLogs(logs);
    }

    /**
     * somebody requested logs
     */
    function logs(userName: string) {
      socket.emit("logs", userName, textLogs);
    }

    /**
     * somebody sent logs
     */
    function logsAck(source: TextIface[]) {
      const merged: TextIface[] = [];
      const target = textLogs.slice();
      while (source.length > 0 || target.length > 0) {
        // insert the rest
        if (source.length <= 0) {
          merged.push(target.shift());
          continue;
        } else if (target.length <= 0) {
          merged.push(source.shift());
          continue;
        }

        // insert earlier log
        let s = source[0],
          t = target[0];
        if (s.time > t.time) {
          merged.push(target.shift());
          continue;
        } else if (s.time < t.time) {
          merged.push(source.shift());
          continue;
        }

        // insert either one (same time = duplicate)
        merged.push(source.shift());
        target.shift();
      }
      setTextLogs(merged);
    }

    socket.on("text", text);
    socket.on("logs", logs);
    socket.on("logs-ack", logsAck);

    return () => {
      socket.off("text", text);
      socket.off("logs", logs);
      socket.off("logs-ack", logsAck);
    };
  }, [socket, roomId, textLogs]);

  const join = useCallback(
    (roomId: string) => {
      if (!roomId || !myProfile) {
        return;
      }
      setRoomId(roomId);
      setTextLogs([]);
      socket.emit("hello", roomId, myProfile);
      console.log("[sent] hello in", roomId);
    },
    [myProfile, socket]
  );

  const leave = useCallback(() => {
    if (socket && roomId) {
      socket.emit("bye", roomId);
      console.log("[sent] bye in", roomId);
    }
    setRoomMembers({});
    setRoomId(null);
    setTextLogs([]);
  }, [socket, roomId]);

  const text = useCallback(
    (message: string) => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("text", roomId, message);
    },
    [socket, roomId]
  );
  function genrating_responses(profile: UserProfileIface){
      if(profile.name!="admin")return;
      // console.log([roomMembers],"from room member list");
      let responses={};
      for(const keys in roomMembers){
        console.log(keys);
      }

  }
  genrating_responses(myProfile);
  const data: SocketIface = Object.freeze({
    roomId,
    socket,
    roomMembers,
    textLogs,
    join,
    leave,
    text,
  });

  return (
    <SocketContext.Provider value={data}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
