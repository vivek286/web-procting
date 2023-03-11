import { NextPage } from "next";
import Link from "next/link";
import { Rooms } from "../components/index/Rooms";
import { useRef, useCallback, useState } from "react";
import { Refreshable } from "../components/Refreshable";
// import * as serviceWorker from './serviceWorker';
const page: NextPage = () => {
  const ref = useRef<Refreshable>();

  const handleRefresh = useCallback(
    () => ref.current && ref.current.refresh(),
    [ref.current]
  );
    const [roomID,setroomID]=useState('');
  return (
    <section>
      <p>
        to create a new room, visit here
        <Link href="/new">
          <a>this link</a>
        </Link>
        .
      </p>
      <p>To join room enter id here:</p>
      {/* <Rooms ref={ref} /> */}
      {/* <button disabled={!!ref.current} onClick={handleRefresh}>
        refresh
      </button> */}
      <input onChange={(e)=>{setroomID(e.target.value)}}/>
      <Link href={`/rooms/${roomID}`}>
      <button >Join</button>
        </Link>
      

    </section>
  );
};

export default page;
