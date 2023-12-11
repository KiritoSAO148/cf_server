const onlineUsers = new Map();
const adminSockets = new Map();

const socketHandler = (socket) => {
  socket.on("admin-connect", (data) => {
    if (data.username === "dat54261001") {
      adminSockets.set(data.id, socket.id);
      console.log("admin online");
    }
  });

  socket.on("user-connect", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`user ${userId} is online`);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-recieve", data);
    }
  });

  socket.on("send-message-to-admin", (data) => {
    const sendAdminSocket = adminSockets.get(data.to);
    if (sendAdminSocket) {
      socket.to(sendAdminSocket).emit("message-recieve", data);
    }
  });

  socket.on("disconnect", () => {
    adminSockets.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        adminSockets.delete(userId);
        console.log(`Admin ${userId} disconnected`);
      }
    });

    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

module.exports = { socketHandler };
