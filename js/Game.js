class Game {
  constructor() {
    this.draw = new Draw();
    this.password = new Password();
    this.wheel = new Wheel();

    this.alfpabet = this.getAlphabet();

    this.currentPassword = "";
    this.currentBonus = 0;
    this.activePlayer = 0;
    this.canClickLetter = false;

    this.startBtn = document.getElementById("start");
    this.addPlayersBtn = document.querySelector("#add_players");
    this.spinWheelBtn = document.querySelector(".btn-spin");

    this.playerNameArea = document.querySelector(".player_name-area");
    this.players = [];
    this.displayElementClass = "display";
    this.hideElementClass = "display-none";

    this.draw.drawEmptyPasswordArea(); // random password in future

    this.initEvents();
  }

  initEvents() {
    this.alfpabet.all.forEach((letter) => {
      letter.addEventListener("click", (e) => {
        this.checkLetterInPass(e);
      });
    });

    // START GAME
    this.startBtn.addEventListener("click", (e) => this.createNewPlayerArea(e));

    // ADD PLAYERS FROM INPUT
    this.addPlayersBtn.addEventListener("click", (e) => {
      this.startGame(e);
    });

    // SPIN
    this.spinWheelBtn.addEventListener("click", () => this.spinWheel());
  }

  startGame(e) {
    e.target.classList.remove(this.displayElementClass);
    document.querySelector("#players").classList.add(this.displayElementClass);
    document.querySelector("#alphabet").classList.remove(this.hideElementClass);

    const players = this.draw.getPlayersNames();
    players.forEach((playerName) => {
      this.players.push(new Player(playerName));
    });

    this.render();
  }

  spinWheel() {
    const bonus = this.wheel.getOption();
    this.currentBonus = bonus;
    this.draw.displayBonus(this.currentBonus);
    this.canClickLetter = true;
  }

  getAlphabet() {
    const vowel = [...document.querySelectorAll(".alphabet_vowel-letter")];
    const consonant = [
      ...document.querySelectorAll(".alphabet_consonant-letter"),
    ];

    return {
      all: [...vowel, ...consonant],
      vowel,
      consonant,
    };
  }

  checkLetterInPass(e) {
    const letter = e.target.textContent;
    if (!this.canClickLetter) return;

    if (
      this.currentPassword.text.toUpperCase().includes(letter.toUpperCase())
    ) {
      this.handleCorrectGuess(letter);
    } else {
      this.handleWrongGuess(letter);
    }
  }

  handleCorrectGuess(letter) {
    this.draw.showLetters(letter);
  }

  handleWrongGuess(letter) {
    console.log("wrong letter", letter);
  }

  createNewPlayerArea(e) {
    e.target.classList.add(this.hideElementClass);
    this.addPlayersBtn.classList.add(this.displayElementClass);

    this.draw.displayAddPlayer();
  }

  async render() {
    const activePlayer = this.players[this.activePlayer];

    this.draw.drawEmptyPasswordArea();
    this.currentPassword = await this.password.password();
    this.draw.displayHiddenPassword(this.currentPassword);
    this.draw.dispalyPlayersArea(this.players);
    this.draw.displayPoints(activePlayer.points);
  }
}

const game = new Game();
