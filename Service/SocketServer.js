const socketIO = require("socket.io");
// import { v4 as uuidv4 } from 'uuid';

const config = require("../config");

const expressApp = require("../Controller/ExpressController");

let socketServer;
runSocketServer = async () => {
  socketServer = socketIO(expressApp.gethttpServer(), {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    serveClient: false,
    path: `/MeetingService/`,
    log: false,
    pingInterval: 10000,
    pingTimeout: 9000,
  });

  socketServer.on("connection", async (socket) => {
    let meetingid = socket.request._query.meetingid;
    let user = JSON.parse(socket.request._query.user);
    // startMeeting(meetingid, user.dbId);
    socket.join(meetingid);
    socket.on("disconnect", () => {
      if (!socketServer.sockets.adapter.rooms.get(meetingid)) {
        console.log("ended",socketServer.sockets.adapter.rooms.get(meetingid));
        // endMeeting(meetingid, user.dbId);
      }
      socketServer.in(meetingid).emit("onMessage", {
        type: "removeUser",
        sessioId: socket.id,
      });
      // userS.removeUserFromList(meetingid, socket.id);
    });

    // await userS.addMeeting(meetingid);
    // await userS.addIntoUserList(
    //   meetingid,
    //   new User(socket.id, meetingid, user.emailId, user.name, user.dbId)
    // );
    socket.on("getAllUser", async (data) => {
      socket.emit("onMessage", userService.getAllUserList());
    });

    socket.on("userAdded", async (data) => {
      console.log(data, 1);
      socket.to(meetingid).emit("onMessage", {
        type: "userAdded",
        peerId: data.peerId,
        userId: data.userId,
        sessioId: socket.id,
        userName: data.userName,
      });
    });

   

    socket.on("chat", async (data) => {
      console.log(data, 1);
      let jsonData = {
        type: "chat",
        userId: data.dbId,
        message: data.message,
        messageType: data.messageType,
        name: data.name,
      };
      socket.in(meetingid).emit("onMessage", jsonData);
      insertChatInDatabase(meetingid, jsonData);
    });
  });
};

getSocketInstance = () => {
  return socketServer;
};

class User {
  sessionId;
  meetingId;
  emailId;
  userName;
  dbid;

  constructor(sessionId, meetingId, emailId, userName, dbid) {
    this.sessionId = sessionId;
    this.meetingId = meetingId;
    this.emailId = emailId;
    this.userName = userName;
    this.dbid = dbid;
  }
}

module.exports = {
  runSocketServer,
  getSocketInstance,
};