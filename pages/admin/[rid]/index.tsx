import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserProfileProvider } from "../../../components/contexts/profile/UserProfileProvider";
import SocketProvider from "../../../components/contexts/socket/SocketProvider";
import { Body } from "../../../components/rooms/AdminBody";
import { PeerProvider } from "../../../components/contexts/socket/peer";
const page: NextPage = () => {
  const [roomId, setRoomId] = useState<string>(null);
  const router = useRouter();

  useEffect(() => {
    setRoomId(router.query.rid as string);
  }, [router.query]);

  return (
    <UserProfileProvider>
      <SocketProvider>
        {/* <PeerProvider> */}
        <Body roomId={roomId} />
        {/* </PeerProvider> */}
        
      </SocketProvider>
    </UserProfileProvider>
  );
};

export default page;
