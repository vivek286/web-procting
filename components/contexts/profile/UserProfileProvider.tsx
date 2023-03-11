import { FC, useState, useEffect, useMemo,useContext } from "react";

import { UserProfileIface } from "../../../shared/UserProfileIface";
import UserProfileContext from "./UserProfileContext";
import SocketContext from "../socket/SocketContext";
export const UserProfileProvider: FC = ({ children }) => {
  const socket = useContext(SocketContext);
  const [ua, setUa] = useState<IUAParser.IResult>(null);
  const [name, setName] = useState<string>(null);
  const [offer, setOffer] = useState<Object>(null);
  let localStream;
  let remoteStream;
  let peerConnection;
  // let offer;
  // fetch user agent and set "ua"
  useEffect(() => {
    async function creatingoffer(){
      localStream= await navigator.mediaDevices.getUserMedia({video: true, audio:false})
  peerConnection = new RTCPeerConnection();
  let temp_offer=await peerConnection.createOffer();
  setOffer(await temp_offer);
  await peerConnection.setLocalDescription (temp_offer)
  console.log("Created offer",offer);
    }
    
   
      
    

    // if(name)
    if (typeof window === "undefined") {
      return;
    }
    let mounted = true;
    fetch("/api/ua").then(async (res) => {
      if (!mounted || res.status !== 200) {
        return;
      }
      setUa(await res.json());
    });
     creatingoffer();
    return () => (mounted = false);
  }, []);
 
  const data: UserProfileIface = useMemo(
    () => ({
      ua,
      get name() {
        return name;
      },
      /** allow setting name from child components */
      set name(val) {
        setName(val);
      },
      webrtcOffer:offer,
      peer:peerConnection
    }),
    [ua, name,offer]
  );
    // console.log(socket?Object.keys(socket?.roomMembers):"empty","Other room members"); 
    
  return (
    <UserProfileContext.Provider value={data}>
      {children}
    </UserProfileContext.Provider>
  );
};
