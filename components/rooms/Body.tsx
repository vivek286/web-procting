import {FC, useState, useEffect, useMemo,useContext } from "react";
import Peer from "simple-peer"
import { useRoomState } from "../contexts/socket/useRoomState";
// import { usePeer } from "../contexts/socket/peer";
import { JoinRoomForm } from "./JoinRoomForm";
import { RoomMembersList } from "./RoomMembersList";
import { TextLogs } from "./TextLogs";
import { SendTextForm } from "./SendTextForm";
import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { getUserId } from "../../server/getUserId";
import React from "react";
interface IProps {
  roomId: string;
}

export const Body: FC<IProps> = ({ roomId }) => {
  const { joined } = useRoomState();
  // const [peer,setpeer]=useState<RTCPeerConnection>(null);
  const profile = useContext(UserProfileContext);
  const socket1 = useContext(SocketContext);
  
  const socket = useContext(SocketContext).socket;
  const [ind,setindex]=useState(0);
  const [ me, setMe ] = useState("")
  const [ stream, setStream ] = useState()
  const [ receivingCall, setReceivingCall ] = useState(false)
  const [ caller, setCaller ] = useState("")
  const [secon,setsecons]=useState(false);
  const [ callerSignal, setCallerSignal ] = useState()
  const [ callAccepted, setCallAccepted ] = useState(false)
  const [ idToCall, setIdToCall ] = useState("")
  const [ callEnded, setCallEnded] = useState(false)
  const [ name, setName ] = useState("")
  const myVideo = React.useRef()
  const userVideo = React.useRef()
  const connectionRef= React.useRef()
  const [peers, setPeers] = useState([]);
  const videoRef = React.useRef();
  const [peerConnections, setPeerConnections] = useState([]);
  useEffect(() => {
	  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
		  setStream(stream)
			  myVideo.current.srcObject = stream
			  
	  })

  socket?.on("me", (id) => {
		  setMe(id)
	  }) 

	  socket?.on("callUser", (data) => {
		  console.log("In calluser useeffect");
		  
		  setReceivingCall(true)
		  setCaller(data.from)
		  setName(data.name)
		  setCallerSignal(data.signal);
	  })
  }, [])

  const callUser = (id) => {
	  const peer = new Peer({
		  initiator: true,
		  trickle: false,
		  stream: stream
	  })
	  peer?.on("signal", (data) => {
		  console.log("in signal function line 54")
		  socket?.emit("callUser", {
			  userToCall: id,
			  signalData: data,
			  from: socket.id,
			  name: profile.name
		  })
	  })
	  peer?.on("stream", (stream) => {
		  console.log("in line 63")
		  handleNewConnection({
			  peerId: name,
			  stream: stream,
			})
			  // userVideo.current.srcObject = stream
			  
	  })
	  socket?.on("callAccepted", (signal) => {
		  console.log("in line 68");
		  setCallAccepted(true)
		  peer?.signal(signal)
	  })

	  connectionRef.current = peer
  }


  const leaveCall = () => {
	  setCallEnded(true)
	  connectionRef.current.destroy()
  }

  function handleNewConnection(peer) {
	  setPeerConnections(prevConnections => [...prevConnections, peer]);
	  let video = document.getElementById(peer.peerId);
		  if (video) {
			  video.srcObject = peer.stream;
			  video.play();
		  }
  }
console.log(profile,"user profile");
function get_admin_id(){
	    for(const keys in socket1.roomMembers){
      let temp=socket1.roomMembers[keys].profile;
	  if(temp.name=="admin"){
		setIdToCall(keys);
		console.log(idToCall,"after setting id");
		callUser(keys)
	  }
	
	
	}
}
  return (
	  <>
	  		<JoinRoomForm roomId={roomId} />
		  <h1 style={{ textAlign: "center", color: '#fff' }}>Skill Board Procting</h1>
	  <div className="container">
	  {/* <RoomMembersList/> */}
		  {/* {Object.keys(socket).length} */}
		  <div className="video-container">
			  <div className="video">
				  {stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				  Your video
			  </div>
			  <div className="video">
				  {callAccepted && !callEnded ?

					  <div className="video">
					  {peerConnections.map(peer => (
					// 	  <div key={peer.peerId}>
					// 		  <br/>
					// 		  <video id={peer.peerId} ref={peer?.streams} autoPlay style={{ width: "300px",border:"4px"}}/>
					//   {peer.peerId}'s video

					// 	  </div>
					<div>
						call connected to admin from {peer.peerId}
					</div>


					  ))}
					  </div>:
				  null
				  }
				  
			  </div>
			  
		  </div>
		  <div className="myId">
			  <textarea
				  id="filled-basic"
				  
				  value={name}
				  onChange={(e) => setName(e.target.value)}
				  style={{ marginBottom: "20px" }}
			  />
			  {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
				  <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
					  Copy ID
				  </Button>
			  </CopyToClipboard> */}

			  <textarea
				  id="filled-basic"
				  
				  value={idToCall}
				  onChange={(e) => setIdToCall(e.target.value)}
			  />
			  <div className="call-button">
				  {callAccepted && !callEnded ? (
					  <button  color="secondary" onClick={leaveCall}>
						  End Call
					  </button>
				  ) : (
					  <button color="primary" aria-label="call" onClick={() => get_admin_id()}>
						  {/* <PhoneIcon fontSize="large" /> */}
						  start procting
					  </button>
				  )}
				  {idToCall}
			  </div>
		  </div>
		 
	  </div>
	  </>
  );
  
 
  
//   async function get_admin_id() {
//     console.log("hello in sendoffer",socket.roomMembers)
//     let count=0;
//     for(const keys in socket.roomMembers){
//       let temp=socket.roomMembers[keys].profile;
     
//       if(temp.name=="admin"){
       
//         console.log("in admin present",keys);
//         setMe(keys);
//         setindex(count);
//         return keys;


        
//       }
//       count++;
      
//     }
//   }
//   // console.l

  
//   return (
//     <div>
//       <JoinRoomForm roomId={roomId} />

//       <button 
//       onClick={()=>{let id=get_admin_id();callUser(id)}}
//       >Start</button>
//       <>
//       {Object.keys(socket?.roomMembers||{}).length} users in room
//       </>
//       {joined && (
//         <>
//           <RoomMembersList />
//           <TextLogs />
          
//           {/* <SendTextForm /> */}
//         </>
//       )}
//     </div>
//   );
};
