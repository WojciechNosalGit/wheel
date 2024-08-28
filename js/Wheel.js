class Wheel {
  constructor() {
    this.options = [200, 500, 400, 300, 100];
  }

  getOption() {
    const random = Math.floor(Math.random() * this.options.length);
    return this.options[random];
  }
}
