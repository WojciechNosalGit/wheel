class Game {
  constructor() {
    this.draw = new Draw();
    this.board = new Board();
    this.password = new Password();
    this.wheel = new Wheel();
    this.sound = new AudioControl();

    this.currentPassword = {
      text: "",
      category: "",
    };
    this.roundsToWin = 2;
    this.chansesForSinglePlayer = 5;
    this.currentBonus = 0;
    this.activePlayerIdx = 0;
    this.players = [];
    this.activePlayer = {};
    this.vowelPrice = 1500;
    this.pointsForRound = 2000;

    this.startBtn = document.getElementById("start");
    this.addPlayersBtn = document.getElementById("add_players");
    this.spinWheelBtn = document.querySelector(".btn-spin");
    this.buyVowelBtn = document.querySelector(".btn-buy_vowel");
    this.guessPasswordBtn = document.querySelector(".btn-guess_password");
    this.confirmPasswordBtn = document.getElementById("confirm_password");
    this.nextRoundBTN = document.getElementById("next_round");

    this.DOMPlayers = document.getElementById("players");
    this.DOMAlphabet = document.getElementById("alphabet");
    this.DOMCategory = document.querySelector(".password_area-category");

    this.board.drawEmptyPasswordArea(); // random password in future
    this.init();
    this.initEvents();
  }

  init() {
    this.draw.hideElement(this.DOMAlphabet);
    this.draw.hideElement(this.DOMPlayers);
    this.draw.hideElement(this.startBtn);
    this.draw.hideElement(this.confirmPasswordBtn);
    this.draw.hideElement(this.nextRoundBTN);
  }

  initEvents() {
    //LETTERS
    this.draw.alfpabet.all.forEach((letter) => {
      letter.addEventListener("click", (e) => {
        this.checkLetterInPass(e);
      });
    });
    // START GAME
    this.startBtn.addEventListener("click", (e) => this.startGame(e));
    // ADD PLAYERS FROM INPUT
    this.addPlayersBtn.addEventListener("click", (e) => {
      this.createNewPlayerArea(e);
    });
    // SPIN
    this.spinWheelBtn.addEventListener("click", () => this.spinWheel());
    //BUY VOWEL
    this.buyVowelBtn.addEventListener("click", () => this.buyVowel());
    //GUESS PASSWORD
    this.guessPasswordBtn.addEventListener("click", () => this.guessPassword());
    //CONFIRM PASSWORD
    this.confirmPasswordBtn.addEventListener("click", () => {
      this.confirmPassword();
    });

    this.nextRoundBTN.addEventListener("click", () => this.startNextRound());
  }

  confirmPassword() {
    const win = this.board.isCorrectPassword();
    if (win) {
      this.winRound();
    } else {
      this.draw.showElement(this.DOMAlphabet);
      this.draw.showElement(this.DOMPlayers);
      this.draw.hideElement(this.confirmPasswordBtn);
      this.board.getPreviousBoard();
      this.handleWrongGuess();
    }
  }

  createNewPlayerArea(e) {
    this.sound.play(this.sound.click);
    this.draw.hideElement(e.target);
    this.draw.showElement(this.startBtn);

    this.board.createDOMInputsForPlayers();
  }

  startGame(e) {
    this.sound.play(this.sound.click);
    this.reset();

    this.draw.hideElement(e.target);
    this.draw.showElement(this.DOMPlayers);

    //Cerate new Player
    const players = this.board.getPlayersNames();
    players.forEach((playerName) => {
      this.players.push(new Player(playerName));
    });
    this.draw.dispalyPlayersArea(this.players);
    // For one player
    if (this.players.length === 1) {
      const activePlayer = this.players[this.activePlayerIdx];
      activePlayer.setChanses(this.chansesForSinglePlayer);
      this.draw.dispalyHearts(activePlayer.chanses);
    }
    this.render();
  }

  spinWheel() {
    this.sound.play(this.sound.click);

    const bonus = this.wheel.getOption();
    this.currentBonus = bonus;
    this.draw.displayBonus(this.currentBonus);
    this.draw.switchActiveAlphabet("consonant");
    this.draw.showButtons("none");
  }

  buyVowel() {
    this.sound.play(this.sound.click);
    this.currentBonus = 0;
    this.draw.switchActiveAlphabet("vowel");
    this.addPoints(1, 0 - this.vowelPrice);
  }

  guessPassword() {
    this.sound.play(this.sound.click);

    this.board.changePasswordToInput();
    this.draw.showButtons("none");
    this.draw.hideElement(this.DOMAlphabet);
    this.draw.hideElement(this.DOMPlayers);
    this.draw.showElement(this.confirmPasswordBtn);
  }

  checkLetterInPass(e) {
    const letter = e.target.textContent;

    this.sound.play(this.sound.click);
    this.draw.hideClickedLetter(letter);
    if (
      this.currentPassword.text.toUpperCase().includes(letter.toUpperCase())
    ) {
      this.handleCorrectGuess(letter);
    } else {
      this.handleWrongGuess(letter);
    }
  }

  handleCorrectGuess(letter) {
    const numberOfLetters = this.board.showLettersOnBoard(letter);

    this.board.showLettersOnBoard(letter);
    //add points lettersnum x bonus
    this.addPoints(numberOfLetters, this.currentBonus);

    //if enougth money for vowel
    this.canBuyVowel()
      ? this.draw.showButtons("all")
      : this.draw.showButtons(["spinWheel", "guessPassword"]);
    this.draw.switchActiveAlphabet("none");
    this.draw.displayBonus();
    //if win
    this.checkIfWin();
  }

  canBuyVowel() {
    return this.vowelPrice <= this.activePlayer.points;
  }

  addPoints(number, bonus) {
    const points = number * bonus;
    const player = this.activePlayer;
    player.addPoints(points);
    this.draw.displayPoints(player.points);
  }

  checkIfWin() {
    if (
      this.currentPassword.text.toUpperCase() ===
      this.board.getStringFromBoard().toUpperCase()
    ) {
      this.winRound();
    }
  }

  winRound() {
    this.board.animateBoard("blink");
    this.sound.play(this.sound.winRound);
    this.addPoints(1, this.pointsForRound);
    this.activePlayer.wins++;
    if (this.players.length > 1) {
      this.draw.displayNumberOfWins(this.activePlayer.wins, this.roundsToWin);
    }

    // Message to display
    setTimeout(() => {
      let message =
        this.players.length > 1
          ? `Rundę wygrywa      ${this.activePlayer.name}                   Masz ${this.activePlayer.points} pkt`
          : `Brawo Twój wynik to ${this.activePlayer.points} pkt`;
      // if winning/final round
      if (
        this.activePlayer.wins === this.roundsToWin &&
        this.players.length > 1
      ) {
        message = `Grę wygrywa        ${this.activePlayer.name}                Wynik: ${this.activePlayer.points} pkt`;
      }
      this.board.displayText(message, true);

      this.draw.hideElement(this.confirmPasswordBtn);
      this.draw.hideElement(this.DOMAlphabet);
      this.draw.hideElement(this.DOMPlayers);
      this.draw.hideElement(this.DOMCategory);

      //show button depending on rounds
      if (
        this.activePlayer.wins !== this.roundsToWin ||
        this.players.length === 1
      ) {
        this.draw.showElement(this.nextRoundBTN);
      } else {
        this.draw.showElement(this.addPlayersBtn);
      }
    }, 1500);
  }

  startNextRound() {
    this.password = new Password();
    this.render();
  }

  handleWrongGuess() {
    this.sound.play(this.sound.wrongLetter);
    //single pllayer
    if (this.players.length === 1) {
      //need to add hearts for single playes
      const singlePayer = this.players[0];
      singlePayer.lostChanse();
      this.draw.dispalyHearts(singlePayer.chanses);
      if (singlePayer.chanses === 0) {
        this.gameOver();
      }
    }
    this.activePlayerIdx === this.players.length - 1
      ? (this.activePlayerIdx = 0)
      : this.activePlayerIdx++;
    this.nextPlayer();
  }

  gameOver() {
    const message = `game over         Twój wynik to ${this.players[0].points} punktów`;
    this.board.displayText(message, true);

    this.draw.showElement(this.addPlayersBtn);
    this.draw.hideElement(this.DOMAlphabet);
    this.draw.hideElement(this.DOMPlayers);
  }

  nextPlayer() {
    this.activePlayer = this.players[this.activePlayerIdx];

    this.draw.classToActivePlayer(this.activePlayerIdx);
    this.draw.displayPoints(this.activePlayer.points);

    this.draw.displayBonus(0);
    this.draw.showButtons(["spinWheel", "guessPassword"]);
    this.draw.switchActiveAlphabet();

    if (this.players.length === 1) return; // only for more players
    this.draw.displayNumberOfWins(this.activePlayer.wins, this.roundsToWin);
  }

  reset() {
    this.password = new Password();
    this.currentBonus = 0;
    this.activePlayerIdx = 0;
    this.players = [];
    this.activePlayer = {};
    this.round = 1;
  }

  async render() {
    this.activePlayer = this.players[this.activePlayerIdx];
    try {
      this.currentPassword = await this.password.password();
    } catch (error) {
      console.error("Error fetching password:", error);
      // Provide a default password or retry mechanism
      this.currentPassword = { text: "ERROR !!!", category: "ERROR" };
    }

    this.draw.resetAlphabet();

    this.board.drawEmptyPasswordArea();
    this.board.displayText(this.currentPassword.text);
    this.board.showCategory(this.currentPassword.category);

    this.draw.showElement(this.DOMCategory);
    this.draw.classToActivePlayer(this.activePlayerIdx);
    this.draw.showElement(this.DOMAlphabet);
    this.draw.showElement(this.DOMPlayers);
    this.draw.showButtons(["spinWheel", "guessPassword"]);
    this.draw.displayPoints(this.activePlayer.points);
    this.draw.displayBonus();
    this.draw.hideElement(this.confirmPasswordBtn);
    this.draw.hideElement(this.nextRoundBTN);

    if (this.players.length === 1) return; // only for more players
    this.draw.displayNumberOfWins(this.activePlayer.wins, this.roundsToWin);
  }
}
const game = new Game();
