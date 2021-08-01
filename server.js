let Players = [];
let blobs = [] //Еда 


function Blob(id,name, x, y, r, mass,color) {
  this.id = id;
  this.name = name;
  this.x = x;
  this.y = y;
  this.r = r;
  this.mass = mass;
  this.color = color      ;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}


var express = require('express');

var app = express();


var server = app.listen(process.env.PORT || 5000, listen);


function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

function CreateFood(){
  for (let i = 0; i<2000;i++){
    let x = getRandomInt(-5*1300,1300*5);
    let y = getRandomInt(-5*800,800*5);
    let color = [getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)] 
    blobs[i] = [x,y,color]
  }
}


CreateFood();

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', Players,blobs);
}


io.sockets.on(
  'connection',

  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(data) {
      var blob = new Blob(socket.id, data.name, data.x, data.y, data.r, data.mass, data.color);
      console.log(data.mass)
      Players.push(blob);
    });

    socket.on('update', function(data) {
      var blob;
      for (var i = 0; i < Players.length; i++) {
        if (socket.id == Players[i].id) {
          blob = Players[i];

        }
      }
      blob.x = data.x;
      blob.y = data.y;
      blob.r = data.r;
      blob.mass = data.mass;
      
    });

    socket.on("Newfood",function(data){
      blobs = data;
    })

    socket.on("killed", function(data) {
      Players[data.index].r = data.r;
      Players[data.index].mass = data.mass;
      Players[data.index].x = getRandomInt(-5*1300,1300*5);
      Players[data.index].y = getRandomInt(-5*800,800*5);

    })


    socket.on('disconnect', function() {
      for (var i = 0; i < Players.length; i++) {
        if (socket.id == Players[i].id) {
          Players.splice(i, 1);
        }
      }
      console.log('Client has disconnected');
      console.log(Players);
    });
  }
);