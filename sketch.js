var client = mqtt.connect("wss://test.mosquitto.org:8081/mqtts");

let nodes = [];
let connections = [];

let selectedNode = undefined;

let firstConnectionNode = undefined;
let firstConnectionPos = undefined;

let connectionTimer = 2000;
let connectionTimerValue = 0;

function preload() {
  // Load JSON Setup
  let setup = loadJSON("./setup.json", (data) => {
    console.log("Registering Devices...");
    registerDevicesFromConfig(data);
    console.log("Setup Loaded");
  });
}

function registerDevicesFromConfig(data) {
  for (let i = 0; i < data.devices.length; i++) {
    let deviceData = data.devices[i];
    console.log(
      "Registering Device: " + deviceData.name + " (" + deviceData.id + ")"
    );

    let device = new Device(
      deviceData.id,
      deviceData.name,
      deviceData.size,
      deviceData.events
    );

    nodes.push(device);
  }

  // connections.push(new Connection("test", nodes[0], nodes[1]));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function checkForNewConnections() {
  // Calculate distances
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i == j) continue;

      let distance = dist(
        nodes[i].x + nodes[i].sizeX / 2,
        nodes[i].y + nodes[i].sizeY / 2,
        nodes[j].x + nodes[j].sizeX / 2,
        nodes[j].y + nodes[j].sizeY / 2
      );

      // stroke(255);
      // line(
      //   nodes[i].x + nodes[i].sizeX / 2,
      //   nodes[i].y + nodes[i].sizeY / 2,
      //   nodes[j].x + nodes[j].sizeX / 2,
      //   nodes[j].y + nodes[j].sizeY / 2
      // );

      // // Text color white
      // fill(255);
      // text(
      //   distance,
      //   (nodes[i].x + nodes[j].x) / 2,
      //   (nodes[i].y + nodes[j].y) / 2
      // );

      if (distance < 100) {
        // Check for inputs and outputs

        // try to connect
        if (connectionTimerValue <= 0) {
          let connection = new Connection(
            Math.random().toString(36).substring(7),
            nodes[i],
            nodes[j]
          );

          console.log("New Connection: " + connection.id);
          connectionTimerValue = connectionTimer;
        } else {
          connectionTimerValue -= deltaTime;
        }
      }
    }
  }
}

function draw() {
  background(0);

  if (selectedNode != undefined) {
    selectedNode.setPosition(mouseX, mouseY);
  }

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
  }

  for (let i = 0; i < connections.length; i++) {
    connections[i].display();
  }

  if (firstConnectionPos != undefined) {
    stroke(255);
    strokeWeight(5);
    line(firstConnectionPos.x, firstConnectionPos.y, mouseX, mouseY);
  }

  checkForNewConnections();
}

function trySelectNode() {
  selectedNode = getNodeUnderMouse();
}

function getNodeUnderMouse() {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].isMouseOver()) {
      return nodes[i];
    }
  }
}

// on mouse click
function mouseClicked(event) {
  if (selectedNode != undefined) {
    selectedNode = undefined;
  } else {
    trySelectNode();
  }
}

function keyPressed(event) {
  if (firstConnectionNode == undefined) {
    // Start creating new connection
    firstConnectionNode = getNodeUnderMouse();
    if (firstConnectionNode == undefined) return;

    console.log("First Connection Node: " + firstConnectionNode.name);

    firstConnectionPos = createVector(
      firstConnectionNode.x + firstConnectionNode.sizeX / 2,
      firstConnectionNode.y + firstConnectionNode.sizeY / 2
    );
  } else {
    // create new connection
    let secondConnectionNode = getNodeUnderMouse();
    if (secondConnectionNode == undefined) return;

    console.log("Second Connection Node: " + secondConnectionNode.name);
    let connection = new Connection(
      Math.random().toString(36).substring(7),
      firstConnectionNode,
      secondConnectionNode
    );
    connections.push(connection);

    firstConnectionNode = undefined;
    firstConnectionPos = undefined;
  }
}

function onConnected() {
  client.subscribe("ALSW/#", function (err) {
    if (!err) {
      client.publish("ALSW/Temperatura", "30");
    }
  });
  console.log("connected");
}

client.on("connect", onConnected);
