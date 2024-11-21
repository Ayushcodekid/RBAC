// routes/chatRoutes.js
const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/ChatController');

const router = express.Router();

router.post('/chat/send', sendMessage);
router.get('/chat/history/:projectId', getChatHistory);

module.exports = router;
