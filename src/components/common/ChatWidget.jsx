import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ChatWidget = ({ shopName, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to our shop! How can I help you?', sender: 'shop' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
      setInputValue('');

      // Simulate shop response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'Thank you for your message. We will get back to you shortly.',
          sender: 'shop'
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-widget" style={styles.widget}>
      <div className="chat-header" style={styles.header}>
        <span style={{ fontWeight: 'bold' }}>{shopName || 'Shop Chat'}</span>
        <CloseOutlined onClick={onClose} style={{ cursor: 'pointer' }} />
      </div>

      <div className="chat-messages" style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#0084ff' : '#f0f0f0',
              color: msg.sender === 'user' ? '#fff' : '#000',
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area" style={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

const styles = {
  widget: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
    border: '1px solid #e0e0e0'
  },
  header: {
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '8px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    wordBreak: 'break-word',
    lineHeight: '1.4'
  },
  inputArea: {
    padding: '12px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: '8px',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '8px 16px',
    outline: 'none',
    fontSize: '14px'
  },
  sendButton: {
    background: 'none',
    border: 'none',
    color: '#0084ff',
    cursor: 'pointer',
    padding: '4px 8px',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

ChatWidget.propTypes = {
  shopName: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default ChatWidget;
