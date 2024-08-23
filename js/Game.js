class Game {
  constructor() {
    this.draw = new Draw();
    this.password = new Password();

    this.alfpabet = this.getAlphabet();
    this.currentPassword = "";
    this.startBtn = document.getElementById("start");
    this.addPlayerBtn = document.getElementById("add_player");
    this.addPlayersBtn = document.querySelector("#add_players");
    this.playerNameArea = document.querySelector(".player_name-area");
    this.players = [];
    this.displayElementClass = "display";
    this.hideElementClass = "display-none";

    this.draw.drawEmptyPasswordArea();

    this.initEvents();
  }

  initEvents() {
    this.alfpabet.all.forEach((letter) => {
      letter.addEventListener("click", (e) => {
        this.checkLetterInPass(e);
      });
    });

    this.startBtn.addEventListener("click", (e) => this.createNewPlayerArea(e));

    this.addPlayersBtn.addEventListener("click", (e) => {
      this.startGame(e);
    });
  }

  startGame(e) {
    e.target.classList.remove(this.displayElementClass);
    document.querySelector("#players").classList.add(this.displayElementClass);
    document.querySelector("#alphabet").classList.remove(this.hideElementClass);

    this.players = this.draw.getPlayersNames();
    this.players.map((item) => {
      const player = new Player(item);
      this.players.push(player);
    });

    this.render();
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
    this.draw.drawEmptyPasswordArea();
    this.currentPassword = await this.password.password();
    this.draw.displayHiddenPassword(this.currentPassword);
  }
}

const game = new Game();
