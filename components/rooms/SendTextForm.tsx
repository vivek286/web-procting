import {
  FC,
  useContext,
  useCallback,
  ChangeEvent,
  useState,
  FormEvent,
} from "react";

import SocketContext from "../contexts/socket/SocketContext";

export const SendTextForm: FC = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [premessage, setpremessage] = useState("");

  /**
   * say something
   */
  const handleText = useCallback(() => {
    if (!socket || message.length <= 0||message==premessage) {
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
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      handleText();
    },
    [handleText]
  );

  /**
   * update text field
   */
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setpremessage(message.toString());
    setMessage(ev.target.value);
  }, []);
  function handling_on_change(e){
    setpremessage(message);
    setMessage(e.target.value);
    handleText();
    
  }
//   setInterval(function() { 
//     handleText();
// }, 3000);
  return (
    
    <div>
<input type="text" onChange={(e)=>{handling_on_change(e)}} value={message} />
      <button onClick={handleText}>say</button>
    </div>
      
    
  );
};
