import {FC, useState, useEffect, useMemo,useContext, useRef, VideoHTMLAttributes } from "react";
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
  const socket=socket1.socket;
    const [ me, setMe ] = useState("")
	const [message,setmessage]=useState("");
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [secon,setsecons]=useState(false);
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()
	const [peers, setPeers] = useState([]);
	const videoRef = useRef();
	const [peerConnections, setPeerConnections] = useState([]);
	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
				
		})

	// socket.on("me", (id) => {
	// 		setMe(id)
	// 	})

		socket?.on("callUser", (data) => {
			console.log("reciving call");
			alert(data.name+" is calling  ");
			setReceivingCall(true);
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
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
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
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer?.on("signal", (data) => {
			console.log("in line 84")
			socket?.emit("answerCall", { signal: data, to: caller })
		})
		peer?.on("stream", (stream) => {
			handleNewConnection({
				peerId: name,
				stream: stream,
			  })
			console.log("in line 88");
			// userVideo.current.srcObject = stream
		})
		
		peer?.signal(callerSignal)
		
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}
	function sendmessage(){


	}
	function handleNewConnection(peer) {
		setPeerConnections(prevConnections => [...prevConnections, peer]);
		let video = document.getElementById(peer.peerId);
			if (video) {
				video.srcObject = peer.stream;
				video.play();
			}
	}
	console.log(profile,"admin profile",socket?.id);
	return (
		<>
		<JoinRoomForm roomId={roomId} />
			<h1 style={{ textAlign: "center", color: '#fff' }}>Skill Board Procting</h1>
		<div className="container">
			{/* <RoomMembersList/> */}
		{Object.keys(socket1?.roomMembers||{}).length} users in room
		<div>
				{(receivingCall && !callAccepted||(true)) ? (
					
						<div className="caller">
							{console.log(peerConnections)}
						<h1 >{name} is calling...</h1>
						<button  color="primary" onClick={answerCall}>
							Answer
						</button>
					</div>
				) : null}
			</div>
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
					Your video
				</div>
				<div className="video">
					{callAccepted && !callEnded ?

						<div className="video">
						{peerConnections.map(peer => (
							<div key={peer.peerId}>
								<br/>
								<video id={peer.peerId} ref={peer?.streams} autoPlay style={{ width: "300px",border:"4px"}}/>
						{peer.peerId}'s video
							<textarea
							onChange={(e)=>setmessage(e.target.value)}
							>


							</textarea>
							<button onClick={()=>sendmessage()}>Send message</button>
							</div>


						))}
						</div>:
					null
					}
					
				</div>
				
			</div>
			
			
			
		</div>
		</>
	);
};
