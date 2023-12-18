class Node {
  constructor(id, x, y, sizeX, sizeY) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.color = color(255);
  }

  display() {
    push();
    strokeWeight(0);
    fill(255);
    text(this.id, this.x, this.y - 10);

    strokeWeight(2);
    stroke(255);
    drawingContext.setLineDash([5, 10]);
    noFill();
    rect(this.x, this.y, this.sizeX, this.sizeY);
    pop();
  }

  setColor(newColor) {
    this.color = newColor;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  isMouseOver() {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.sizeX &&
      mouseY >= this.y &&
      mouseY <= this.y + this.sizeY
    );
  }
}

class Device extends Node {
  constructor(id, name, size, events) {
    super(id, 0, 0, size.width, size.height);

    this.id = id;
    this.name = name;
    this.events = events;

    this.selectedChannel = 0;

    this.lastX = 0;
    this.lastY = 0;
    this.inactivityTimer = 0;

    this.registerOOCSIEvents();
  }

  checkForMovement() {
    // Check if position has changed
    if (
      Math.abs(this.x - this.lastX) > 25 ||
      Math.abs(this.y - this.lastY) > 25
    ) {
      // Reset inactivity timer
      this.inactivityTimer = 0;
      // Update last position
      this.lastX = this.x;
      this.lastY = this.y;
    } else {
      // Increase inactivity timer
      this.inactivityTimer += deltaTime;
    }
  }

  update() {
    this.checkForMovement();

    this.display();
    if (this.inactivityTimer < 5000) this.displayEvents();
  }

  registerOOCSIEvents() {
    for (let i = 0; i < this.events.length; i++) {
      let eventName = this.events[i];
      // OOCSI.subscribe(this.id + "-" + eventName, this.onOOCSIEvent);
    }
  }

  displayEvents() {
    for (let i = 0; i < this.events.length; i++) {
      push();

      strokeWeight(2);
      noFill();

      let eventName = this.events[i];
      let type = eventName.type;
      let x =
        this.x +
        Math.cos((i * Math.PI * 2) / this.events.length) * 100 +
        this.sizeX / 2;
      let y =
        this.y +
        Math.sin((i * Math.PI * 2) / this.events.length) * 100 +
        this.sizeY / 2;
      stroke(255);
      circle(x, y, 50);

      if (type === "input") {
        // fill(255);
        // circle(x, y, 30);
        // Draw arrow
        push();
        strokeWeight(5);
        stroke(255);
        translate(x, y);
        rotate((i * Math.PI * 2) / this.events.length + Math.PI * 1.5);
        line(0, 0, 0, -50);
        pop();
      } else {
        // Draw arrow
        push();
        strokeWeight(5);
        stroke(255);
        translate(x, y);
        rotate((i * Math.PI * 2) / this.events.length + Math.PI / 2);
        line(0, 0, 0, -50);
        pop();
      }

      // Centred text in rect of eventname
      fill(255);
      noStroke();
      textAlign(CENTER, CENTER);

      // rotate cetered on circle

      text(eventName.name, x, y);
      pop();
      pop();
    }
  }
}

class Connection {
  constructor(id, from, to) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.color = color(255);
  }

  display() {
    stroke(this.color);
    strokeWeight(5);
    line(
      this.from.x + this.from.sizeX / 2,
      this.from.y + this.from.sizeY / 2,
      this.to.x + this.to.sizeX / 2,
      this.to.y + this.to.sizeY / 2
    );
  }

  setColor(newColor) {
    this.color = newColor;
  }
}
