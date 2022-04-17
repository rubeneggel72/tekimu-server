
const express = require('express');
const app = express();
require('dotenv').config()

server = app.listen(process.env.PORT, () => {
  console.log("Listening on port: ", process.env.PORT);
  });
//socket.io instantiation
const io = require("socket.io")(server);


// const app = require("express");
// const http = require("http").createServer(app);

// const server=server.listen(process.env.PORT || 3000);
// const io = require("socket.io")(server);
// const PORT = 8080;

// http.listen(PORT, () => {
//   console.log("Listening on port: ", PORT);
// });



// const app = express();

// server = app.listen(process.env.PORT || 8080);

// const io = require("socket.io")(server);

const bodyParser = require("body-parser");
const userRoute = require("./userRoute");
const chatRoute = require("./chatRoute");
const mainRoute = require("../routes/mainRoute");
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");
const userModel = require("../models/userModel");
const Seed = require("../config/seed");
/* Listenning port */



/* Middlewares */
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/users/", userRoute.router);
app.use("/chat/", chatRoute.router);
app.use("/main/", mainRoute.router);

app.get("/seed", (req, res) => {
  Seed.getUserSeed();
  res.send({ message: "Database created succefully" });
});
app.get("/setup", (req, resp) => {
  require("../config/setup");
  resp.send({ message: "Database Matcha created succefully" });
});

/* Socket.io */

var connections = [];
var clients = [];
var onlineTab = [];

var mainSocket = io.on("connection", async socket => {
  console.log("socket")
  await onlineTab.push({
    userID: socket.handshake.query["userID"],
    socketID: socket.id
  
  });

  chatController.onlineStatus(socket.handshake.query["userID"]);
  console.log("%d socket(s) online", onlineTab.length);
  console.log({ onlineTab }); 

  socket.broadcast.emit("online", {
    user_id: socket.handshake.query["userID"],
    status: "Online"
  });

  socket.on("sendNotif", async (type, user_id, target_id) => {
    var sendNotif = await userController.manageNotif(type, user_id, target_id);
    var isBlocked = await userModel.checkUserIsBlocked(user_id, target_id);
    if (sendNotif && !isBlocked) {
      socket.broadcast.emit("newNotif", target_id);
    }
  });

  socket.on("disconnect", reason => {
    console.log(reason);
    for (var i = 0; i < onlineTab.length; i++) {
      if (onlineTab[i]["socketID"] == socket.id) onlineTab.splice(i, 1);
    }
    var result = onlineTab.find(
      elem => elem.userID === socket.handshake.query["userID"]
    );
    if (result === undefined) {
      socket.broadcast.emit("offline", {
        user_id: socket.handshake.query["userID"],
        status: "Offline"
      });
      chatController.offlineStatus(socket.handshake.query["userID"]);
      console.log("%d socket(s) online", onlineTab.length);
      console.log({ onlineTab }); 
    }
  });
});
var nsp = io.of("/chat");

nsp.on("connection", socket => {
  // Get variables
  var userID = socket.handshake.query["userID"];
  var userToken = socket.handshake.query["token"];
  var userName = socket.handshake.query["userName"];
  var room_id = socket.handshake.query["room_id"];
console.log("socket "+userName)
  socket.join(room_id);

  socket.on(room_id, async (data, userID_other) => {
    chatController.saveMessage([data, userID, room_id]);
    chatController.saveNotification(
      userID_other,
      userID,
      "message",
      "",
      room_id
    );
    socket.broadcast.emit(room_id, { data, userID, userName });
    var isBlocked = await userModel.checkUserIsBlocked(userID_other, userID);
    if (!isBlocked) mainSocket.emit("new message", { room_id, userID_other });
  });

  socket.on("readMessage", data => {
    chatController.readMessage(data, userID);
    mainSocket.emit("readMessage", userID, data);
  });

  socket.on("disconnect", () => {
    connections.splice(-1, 1);
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.socketID == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });
});
