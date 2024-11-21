// const express = require('express')
// const app = express();
// const cors = require('cors');
// const mongoose= require('mongoose');
// const authRoutes=  require("./routes/authRoutes")
// const projectRoutes = require("./routes/projectRoutes");

// require('dotenv').config();

// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());


// app.use("/api", authRoutes)
// app.use("/api", projectRoutes);


// mongoose.connect(process.env.DB_URL).then((result)=>{
//     console.log("DB connected successfully");
// })
// .catch(err=>{
//     console.log(err);
// })


// app.listen(PORT,()=>{
//     console.log(`Server started at ${PORT} `)
// })

















const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/ChatRoutes');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', chatRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error(err));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinProject', ({ projectId }) => {
    console.log(`User joined project: ${projectId}`);
    socket.join(projectId);
  });

  socket.on('sendMessage', (data) => {
    console.log('Message received:', data);
    io.to(data.projectId).emit('receiveMessage', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
