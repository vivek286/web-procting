export interface UserProfileIface {
  
  ua: IUAParser.IResult;
  name: string;
  webrtcOffer:Object;
  peer:RTCPeerConnection;
}
