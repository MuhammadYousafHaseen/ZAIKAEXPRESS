// server.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3001', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: ["https://zaikaexpress-yousaf-haseens-projects.vercel.app","https://aimsgedu.online", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH", "CONNECT"],
    },
  });
  

  io.on('connection', (socket) => {
    console.log('New connection');

    socket.on("send-location", (data) => {
  // Log incoming location
  console.log("Received location from owner:", data);

  // Broadcast to clients
  io.emit("location-update", data);
});


    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : 'production'}`);
  });
});
