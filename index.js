const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/index.html");
});

const connections = [null, null];

io.on("connection", (socket) => {

  let id = -1;
  for (const i in connections) {
    if (connections[i] === null) {
      id = i;
      connections[id] = true;
      break;
    }
  }

  console.log("Usuario ha entrado al chat");
  
  socket.emit('id', id);
  console.log(`EL id asignado es ${id}`)
  
  if (id === -1) return;
  
  socket.on('username', (username) => {
    console.log(`${id}._${username}`);
    io.emit("username", username);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
    console.log(`Usuario ${id} se ha desconectado`);
    connections[id] = null;
  });
});

server.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
