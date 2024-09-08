class Player {
  constructor(name) {
    this.name = name;
    this.points = 0;
    this.activeBonus = 0;
    this.chanses = 0;
    this.wins = 0;
  }

  addPoints(points) {
    this.points += points;
  }

  setChanses(number) {
    this.chanses = number;
  }

  lostChanse() {
    this.chanses--;
  }
}
