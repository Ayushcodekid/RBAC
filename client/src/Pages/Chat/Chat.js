import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);


  const projectId = localStorage.getItem('selectedProject');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    console.log('projectId:', projectId); // Log the projectId to verify it's being passed correctly
  console.log('userId:', userId); // Log the userId to verify it's being passed correctly
    if (projectId) {
      socket.emit('joinProject', { projectId });
    } else {
      console.error('projectId is undefined or missing!');
    }
  
    socket.on('receiveMessage', (data) => {
      console.log('Message received:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    // Fetch chat history on component mount
    axios.get(`http://localhost:8000/api/chat/history/${projectId}`)
      .then((response) => {
        setMessages(response.data.data);
      })
      .catch((err) => console.error('Error fetching chat history:', err));
  
    return () => {
      socket.off('receiveMessage');
    };
  }, [projectId]);
  

  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      projectId,
      senderId: userId,
      senderName: username,
      message
    };

    // Emit message via Socket.IO
    socket.emit('sendMessage', newMessage);

    // Optionally save message to the backend
    axios.post('http://localhost:8000/api/chat/send', newMessage)
      .catch((err) => console.error('Error sending message:', err));

    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderName}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
