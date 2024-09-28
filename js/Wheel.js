class Wheel {
  constructor(canvasId, wheeleResultElement, wheelContainer) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    (this.letterEL = "Litera"),
      (this.brokeEL = "Bankrut"),
      (this.stopEL = "stop");
    this.segments = [
      2000,
      150,
      200,
      350,
      550,
      250,
      500,
      this.stopEL,
      400,
      1200,
      500,
      600,
      800,
      1000,
      450,
      700,
      200,
      1500,
      this.brokeEL,
      500,
      200,
      400,
    ];
    this.colors = [
      "#fd79a8",
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
      "#81ecec",
      "#fd79a8",
      "#d63031",
      "#fab1a0",
      "#0984e3",
      "#fdcb6e",
      "#2d3436",
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
    this.selectedSegmentIndex = null; // To store the index of the selected segment

    this.sound = new AudioControl();

    this.drawWheel();
  }

  drawWheel() {
    for (let i = 0; i < this.segments.length; i++) {
      const angle = this.startAngle + i * this.segmentAngle;
      this.ctx.beginPath();
      this.ctx.moveTo(250, 250); // Center of the wheele
      this.ctx.arc(250, 250, 250, angle, angle + this.segmentAngle);

      // Check if this is the selected segment
      if (i === this.selectedSegmentIndex) {
        this.ctx.fillStyle = "blue"; // Blue background for selected segment
      } else {
        this.ctx.fillStyle = this.colors[i]; // Default color for others
      }

      this.ctx.fill();
      this.ctx.stroke();

      // Tekst na segmencie
      this.ctx.save();
      this.ctx.translate(250, 250);
      this.ctx.rotate(angle + this.segmentAngle / 2);
      this.ctx.textAlign = "center";

      // Check if this is the selected segment
      if (i === this.selectedSegmentIndex) {
        this.ctx.fillStyle = "yellow"; // Yellow text for selected segment
      } else if (
        this.segments[i] === this.brokeEL ||
        this.segments[i] === this.stopEL
      ) {
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
    if (text === this.brokeEL) return this.ctx.fillText(text, 170, 10);
    if (text === this.letterEL) return this.ctx.fillText(text, 170, 10);
    for (let i = 0; i < text.length; i++) {
      this.ctx.fillText(text[i], currentX, y);
      currentX += this.ctx.measureText(text[i]).width + spacing; // Add letter width + spacing
    }
  }

  showWheele() {
    this.wheelContainer.classList.toggle("fadeIn_wheele");
  }

  hideWheel(time) {
    setTimeout(() => {
      this.wheelContainer.classList.toggle("fadeIn_wheele");
    }, time);
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
          //animation when result
          this.blinkSegment(this.selectedSegmentIndex); // Trigger blinking
          this.sound.play(this.sound.wheelResult);
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

    this.selectedSegmentIndex = segmentIndex; // Save the selected segment index
    this.drawWheel(); // Redraw the wheel with the highlighted segment

    const result = () => {
      if (this.segments[segmentIndex] === this.brokeEL) return -1;
      if (this.segments[segmentIndex] === this.stopEL) return 0;
      // if (this.segments[segmentIndex] === this.letterEL) return 1;
      return this.segments[segmentIndex];
    };
    return result();
  }

  blinkSegment(segmentIndex) {
    let blinkCount = 0;
    const blinkInterval = 50; // Time in milliseconds for each blink

    const blink = () => {
      this.selectedSegmentIndex = blinkCount % 2 === 0 ? segmentIndex : null;
      this.drawWheel();
      blinkCount++;

      if (blinkCount < 4) {
        setTimeout(blink, blinkInterval);
      } else {
        this.selectedSegmentIndex = null; // Reset to original state
        this.drawWheel();
      }
    };

    blink();
  }
}
