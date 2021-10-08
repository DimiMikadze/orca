import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Events } from './constants';
import { onlineUsers, updateUserIsOnline } from './db';

const users = {};

function getCookie(cookie, name) {
  cookie = ';' + cookie;
  cookie = cookie.split('; ').join(';');
  cookie = cookie.split(' =').join('=');
  cookie = cookie.split(';' + name + '=');
  if (cookie.length < 2) {
    return null;
  } else {
    return decodeURIComponent(cookie[1].split(';')[0]);
  }
}

setInterval(async () => {
  const currentUsers = await onlineUsers();
  currentUsers.forEach(async (u) => {
    if (!users[u._id.toString()]) {
      updateUserIsOnline(u._id, false);
    }
  });
}, 5 * 60 * 1000);

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket: any, next) => {
    if (socket.handshake.headers.cookie) {
      const token = getCookie(socket.handshake.headers.cookie, 'token');
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          return next(new Error('Authentication error'));
        }
        socket.authUser = decoded.user;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: any) => {
    console.log('Socket connection. socket.connected: ', socket.connected);
    const userId = socket.authUser._id;
    if (!users[userId]) {
      users[userId] = {
        socketId: socket.id,
        userId: socket.authUser._id,
      };
    }

    /**
     * Notifications.
     */
    socket.on(Events.CREATE_NOTIFICATION, (data) => {
      const user = users[data.user];
      if (user) {
        console.log('Sending create notification, socketId: ', user.socketId);
        io.to(user.socketId).emit(Events.CREATE_NOTIFICATION_REQUEST, data);
      }
    });

    socket.on(Events.DELETE_NOTIFICATION, (data) => {
      const user = users[data.user];
      if (user) {
        console.log('Sending delete notification, socketId: ', user.socketId);
        io.to(user.socketId).emit(Events.DELETE_NOTIFICATION_REQUEST, data);
      }
    });

    /**
     * Messaging.
     */
    socket.on(Events.CREATE_MESSAGE, (data) => {
      const receiverId = data.receiver._id;
      const senderId = data.sender._id;
      if (users[receiverId] && users[senderId]) {
        io.to(users[receiverId]?.socketId).emit(Events.SEND_MESSAGE, data);
        io.to(users[senderId]?.socketId).emit(Events.SEND_MESSAGE, data);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      updateUserIsOnline(userId, false);
      delete users[socket.authUser._id];
    });
  });
};
