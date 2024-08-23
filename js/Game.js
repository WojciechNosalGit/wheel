class Game {
  constructor() {
    this.draw = new Draw();
    this.password = new Password();
  }
  render() {
    console.log("Game");
  }
}

const game = new Game();
game.render();
