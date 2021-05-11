import { getClientBuildManifest } from 'next/dist/client/route-loader';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import UsernameField from '../components/username-field/UsernameField';

export default function Home() {
  //Save the socket
  const [socket, setSocket] = useState(null);

  //Whether the username is set
  const [isUsernameConfirmed, setUsernameConfirmed] = useState(false);

  //State for the username
  const [username, setUsername] = useState("");

  //State for the form field
  const [message, setMessage] = useState("");

  //State for message history
  const [history, setHistory] = useState([
    {
      username: '',
      message: ''
    }
  ]);

  const connectSocket = () => {
    //Prime the server first. Yes, this is an extra call and is inefficient.
    //but we're using NextJS for convenience, so this is a necessary evil.
    fetch("/api/chat");
    // after making sure that socket server is primed, connect to it.
    
    if (!socket) {
      const newSocket = io();

      // Confirms connection
      newSocket.on("connect", () => {
        console.log("Chap app connected");
      });

      // Handles message
      newSocket.on("message", (msg) => {
        setHistory((history) => [...history, msg]);
      });

      // Logs when server disconnects
      newSocket.on("disconnect", () => {
        console.warn("WARNING: chat app disconnected");
      });

      setSocket(() => newSocket);
    }
  };

  // The websocket code
  useEffect(() => {
    connectSocket();
  }, []);

  // This method submits the form and sends the message to the server.
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!socket) {
      alert("Chatroom not connected yet. Try again in a little bit");
      return;
    }

    // Prevent empty submissions
    if (!message || !isUsernameConfirmed) {
      return;
    }
    
    // Submit and blank-out the field.
    socket.emit("message-submitted", {message, username});
    setMessage("");
  };

  return (
    <div> 
      {/* this sets the page's title and favicon */}
      <Head>
        <title>Noise</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

    <h1>NOISE</h1>

    <div className="user-messaging">  
      {/* The username area */}
      <UsernameField
        completed={isUsernameConfirmed}
        value={username}
        onChange={(value) => setUsername(value)}
        onSubmit={() => setUsernameConfirmed(true)}
      />

      {/* Form submission */}
      <div className="message-field">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              className="message-typing"
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                username ? "Enter your message..." : "Set username..."
              }
              disabled={!isUsernameConfirmed}
            />
          </label>
          <input className="send-button" type="submit" value="SEND" disabled={!isUsernameConfirmed} />
        </form>
      </div>
     </div> 

      {/* The list of messages */}
      <div className="chatfeed-container">
        {history.map(({ username, message }, i) => (
          <div key={i}>
            <b>{username}</b> {message}
          </div>
        ))}
      </div>

    </div>
  );
};


