1

let list = document.getElementById("dashboard");

const userName = prompt('Ваш ник');
// Keep track of our socket connection
var socket;
var NumPlayer;
var blob;
var Players = [];
var blobs = []
let blobsInfoToCreate = []
var test = [33]

var zoom = 1;
var StandartRadiusBlob = 15;

function drawshow(Players) {
  
  fill(Players.color);
  ellipse(Players.x, Players.y, Players.r * 2, Players.r * 2);

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(Players.name, Players.x, Players.y+10);
};



function setup() {
  createCanvas(1300, 800);

  socket = io();

  blob = new Blob(random(width), random(height), StandartRadiusBlob,[random(255),random(255),random(255)]);
  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    name: userName,
    mass: blob.mass,
    color: blob.color
  };
  socket.emit('start', data);

  socket.on('heartbeat', function(data,eats) {
    Players = data;
    blobsInfoToCreate = eats;
  });
}



function draw() {
  for (let i = 0; i<2000;i++){
    if (blobsInfoToCreate[i] == undefined) continue 
    blobs[i] = new Blob(blobsInfoToCreate[i][0],blobsInfoToCreate[i][1],15,blobsInfoToCreate[i][2])
  }
  background(160,160,160);
  // console.log(blob.pos.x, blob.pos.y);
  translate(width / 2, height / 2);
  var newzoom = StandartRadiusBlob / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  // scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  Players.sort((a, b) => a.r <= b.r ? 1 : -1);
  var inner = `<div class="leader_title">Leaders</div>`;
  for (var i = Players.length - 1; i >= 0; i--) {
    var id = Players[i].id;
    if (id.substring(2, id.length) !== socket.id) {
      inner +=`<div class="leader_people">${Players[i].name} - ${Players[i].mass}</div>`;
      
      drawshow(Players[i])
    }
    
    
  }
  list.innerHTML = inner;


  for ( var i=blobs.length-1; i>=0;i--){
    if ( blob.eats(blobs[i]) ){
        blobsInfoToCreate.splice(i,1);
        blobsInfoToCreate.push([random(-5*1300,1300*5),random(-5*1300,1300*5),[random(255),random(255),random(255)]])
        socket.emit("Newfood",blobsInfoToCreate)
    }
    if ( blobs[i] != undefined ) // Иногда появлсяется ошибка
    blobs[i].show();
  } 

  for ( var i=Players.length-1; i>=0;i--){
    if (socket.id == Players[i].id) NumPlayer = i
  }

  for ( var i=Players.length-1; i>=0;i--){
    if (socket.id != Players[i].id){
      if ( blob.eats_enemy(Players[i]) ){
        
        if (blob.r >= Players[i].r) {
        } else {
          blob.mass = 0;
          blob.r = 15;
          let x = random(-5*1300,5*1300)
          let y = random(-5*1300,5*1300)
          blob.pos = createVector(x,y)
        }
      }
    }
  }

  blob.update();
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    mass: blob.mass,
  };
  socket.emit('update', data);

}