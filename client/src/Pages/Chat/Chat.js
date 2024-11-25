

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(true); // Controls popup visibility

  const projectId = localStorage.getItem('selectedProject');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Join project room
    if (projectId) {
      socket.emit('joinProject', { projectId });
    } else {
      console.error('projectId is undefined or missing!');
    }

    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Fetch chat history on page load
    axios
      .get(`http://localhost:8000/api/chat/history/${projectId}`)
      .then((response) => {
        const chatHistory = response.data.data;
        setMessages(chatHistory); // Load history into state
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
      message,
    };

    // Emit message via Socket.IO
    socket.emit('sendMessage', newMessage);

    // Save message to backend
    axios
      .post('http://localhost:8000/api/chat/send', newMessage)
      .then((response) => {
        console.log('Message saved:', response.data);
      })
      .catch((err) => console.error('Error sending message:', err));

    setMessage('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: isChatOpen ? '20%' : '20%',
        height: isChatOpen ? '400px' : '50px',
        backgroundColor: '#003534',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: '0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#025E4C',
          color: '#FFF',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Project Chat</h3>
        <span>{isChatOpen ? '▼' : '▲'}</span>
      </div>

      {/* Messages Area */}
      {isChatOpen && (
        <div
          style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            backgroundColor: '#002D2B',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px',
                  backgroundColor: msg.senderId === userId ? '#01796F' : '#013E3E',
                  color: '#FFF',
                  borderRadius: '10px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    opacity: 0.8,
                  }}
                >
                  {msg.senderName}
                </p>
                <p style={{ margin: '5px 0' }}>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      {isChatOpen && (
        <form
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            padding: '10px',
            backgroundColor: '#013E3E',
            borderTop: '1px solid #025E4C',
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#01796F',
              border: 'none',
              color: '#FFF',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            ➤
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
