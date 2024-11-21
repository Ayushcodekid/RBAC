// controllers/chatController.js
const ChatMessage = require('../models/Chat');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { projectId, senderId, senderName, message } = req.body;

    if (!projectId || !senderId || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newMessage = new ChatMessage({ projectId, senderId, senderName, message });
    await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get chat history for a project
exports.getChatHistory = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const chatHistory = await ChatMessage.find({ projectId }).sort({ timestamp: 1 });

    res.status(200).json({ message: 'Chat history retrieved', data: chatHistory });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ message: 'Error retrieving chat history' });
  }
};
