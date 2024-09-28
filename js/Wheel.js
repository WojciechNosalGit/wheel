class Wheel {
  constructor(canvasId, wheeleResultElement, wheelContainer) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.segments = [
      "Bankrut",
      1500,
      200,
      350,
      550,
      250,
      500,
      "STOP",
      400,
      150,
      500,
      200,
      "Bankrut",
      1000,
      250,
      150,
      200,
      300,
      "STOP",
      500,
      200,
      400,
    ];
    this.colors = [
      "#2d3436",
      "#fdcb6e",
      "#0984e3",
      "#6c5ce7",
      "#e84393",
      "#81ecec",
      "#fd79a8",
      "#d63031",
      "#ffeaa7",
      "#a29bfe",
      "#fab1a0",
      "#00b894",
      "#2d3436",
      "#fd79a8",
      "#00b894",
      "#fab1a0",
      "#0984e3",
      "#fdcb6e",
      "#d63031",
      "#81ecec",
      "#fdcb6e",
      "#a29bfe",
    ];
    this.resultDiv = document.querySelector(wheeleResultElement);
    this.wheelContainer = document.querySelector(wheelContainer);
    this.isSpinning = false;
    this.startAngle = 0;
    this.segmentAngle = (2 * Math.PI) / this.segments.length;
    this.currentRotation = 0;
    this.totalRotation = 0;

    this.sound = new AudioControl();

    this.drawWheel();
  }

  drawWheel() {
    for (let i = 0; i < this.segments.length; i++) {
      const angle = this.startAngle + i * this.segmentAngle;
      this.ctx.beginPath();
      this.ctx.moveTo(250, 250); // Center of the wheele
      this.ctx.arc(250, 250, 250, angle, angle + this.segmentAngle);
      this.ctx.fillStyle = this.colors[i];
      this.ctx.fill();
      this.ctx.stroke();

      // Tekst na segmencie
      this.ctx.save();
      this.ctx.translate(250, 250);
      this.ctx.rotate(angle + this.segmentAngle / 2);
      this.ctx.textAlign = "center";
      // Color
      if (this.segments[i] === "Bankrut" || this.segments[i] === "STOP") {
        this.ctx.fillStyle = "white";
      } else {
        this.ctx.fillStyle = "#000"; // Czarny dla innych wartości
      }
      this.ctx.font = "30px SuperPlayful";
      this.drawTextWithSpacing(this.segments[i].toString(), 130, 10, 12);
      this.ctx.restore();
    }
  }

  drawTextWithSpacing(text, x, y, spacing) {
    let currentX = x;
    if (text === "Bankrut") return this.ctx.fillText(text, 170, 10);
    for (let i = 0; i < text.length; i++) {
      this.ctx.fillText(text[i], currentX, y);
      currentX += this.ctx.measureText(text[i]).width + spacing; // Add letter width + spacing
    }
  }

  showWheele() {
    this.wheelContainer.classList.toggle("fadeIn_wheele");
  }
  hideWheel() {
    setTimeout(() => {
      this.wheelContainer.classList.toggle("fadeIn_wheele");
    }, 1200);
  }

  spinWheel() {
    return new Promise((resolve) => {
      if (this.isSpinning) return; // Can't click while spinning
      this.isSpinning = true;

      // Random spin time (2-4s)
      const spinDuration = Math.random() * 2000 + 2000;
      const startSpeed = Math.random() * 5 + 2; // Initial rotation speed
      this.totalRotation = 0;
      this.currentRotation = startSpeed;

      let startTime = null;
      let lastTickAngle = this.startAngle;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3); // ease-out for stopping the wheel

      const rotateWheel = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Slowing down the spin
        this.currentRotation = (startSpeed * (1 - easeOut(progress))) / 30;
        this.startAngle += this.currentRotation;
        this.drawWheel();

        //Sound
        if (Math.abs(this.startAngle - lastTickAngle) >= this.segmentAngle) {
          this.sound.play(this.sound.spinWheel);
          lastTickAngle = this.startAngle; // Reset angle for next click sound
        }
        if (progress < 1) {
          requestAnimationFrame(rotateWheel);
        } else {
          this.isSpinning = false;
          const result = this.showResult();
          resolve(result); // Return result
        }
      };

      requestAnimationFrame(rotateWheel);
    });
  }

  showResult() {
    const normalizedAngle = this.startAngle % (2 * Math.PI);
    const segmentIndex =
      Math.floor((2 * Math.PI - normalizedAngle) / this.segmentAngle) %
      this.segments.length;

    const result = () => {
      if (this.segments[segmentIndex] === "Bankrut") return -1;
      if (this.segments[segmentIndex] === "STOP") return 0;
      return this.segments[segmentIndex];
    };
    return result();
  }
}
