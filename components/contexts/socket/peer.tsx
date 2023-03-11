import React, { useEffect, useMemo } from "react";

const peerContext=React.createContext(null);
export const usePeer=()=>React.useContext(peerContext);
export const PeerProvider=(props)=>{
    let peer;
    useEffect(()=>{
        peer=useMemo(()=>new RTCPeerConnection({
            iceServers:[
                {
                    urls:[
                        "stun.l.google.com:19302",
                        "stun1.l.google.com:19302",
                    ]
                }
            ]
        }),[]);
    },[])
    

    const createOffer=async()=>{
        const offer=await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

 


    return(
        <peerContext.Provider value={{peer,createOffer}}>{props.children}</peerContext.Provider>
    )

}