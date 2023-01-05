const express = require("express");
const { ExpressPeerServer } = require("peer");
const { config } = require("../config");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");


const env = process.env.NODE_ENV || 'development';
app.use(cors());

let httpServer;
let peerServer;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.send("Server is running");
});




app.get('/checkconnection', async (req , res) => {
  res.send(await checkconnection());
} )
// Sample routing.





runHttpServer = async () => {
  httpServer = http.createServer(app);
  httpServer.listen(config.listenPort);
  setTimeout(() => {
    peerServer = ExpressPeerServer(gethttpServer(), {
      debug: true,
    });
    app.use("/peerjs", peerServer);
  }, 2000);

  // return server.Server(app);
};

gethttpServer = () => {
  return httpServer;
};

module.exports = {
  runHttpServer,
  gethttpServer,
};