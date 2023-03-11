import { FC, useCallback, useContext, useState } from "react";

import SocketContext from "../contexts/socket/SocketContext";
import { User } from "./User";
import { DateString } from "./DateString";

export const TextLogs: FC = () => {
  const socket = useContext(SocketContext);
  // starting sending from view

  const [message, setMessage] = useState("");
  const [premessage, setpremessage] = useState("");

  /**
   * say something
   */
  const handleText = useCallback(() => {
    if (!socket||message==premessage) {
      return;
    }
    console.log(premessage,"preemessage");
    socket.text(message);
    // setMessage("");
    setpremessage(message);
  }, [socket, message]);

  /**
   * handle form submission (call text)
   */
  
  /**
   * update text field
   */
  
  function handling_on_change(e){
    setpremessage(message);
    setMessage(e.target.value);
    handleText();
    
  }








  // ending it
  
  return (
    <section>
      <style jsx>{`
        span {
          color: #999;
        }
      `}</style>
      <h4>logs</h4>
      {Array.isArray(socket?.textLogs) && socket.textLogs.length >0&&premessage!=socket.textLogs[socket.textLogs.length-1].message? socket.roomMembers[socket.textLogs[socket.textLogs.length-1].sender]?.profile.name+" is ":
      "You are"} typing...
      <br/>
      <textarea rows={20} onChange={(e)=>{handling_on_change(e)}}
       value={Array.isArray(socket?.textLogs) && socket.textLogs.length >0&&premessage!=socket.textLogs[socket.textLogs.length-1].message?socket.textLogs[socket.textLogs.length-1].message:message}/>
       <button onClick={handleText}>refresh rendering</button>
      
    </section>
  );
};
