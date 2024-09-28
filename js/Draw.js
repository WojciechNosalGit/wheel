class Draw {
  #displayElementClass;
  #hideElementClass;
  constructor() {
    this.alfpabet = this.getAlphabet();
    this.buttons = {
      spinWheel: document.querySelector(".btn-spin"),
      buyVowel: document.querySelector(".btn-buy_vowel"),
      guessPassword: document.querySelector(".btn-guess_password"),
    };
    this.pointsArea = document.querySelector(".stats-points");

    this.#displayElementClass = "display";
    this.#hideElementClass = "display-none";
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

  showElement(element) {
    element.classList.remove(this.#hideElementClass);
    element.classList.add(this.#displayElementClass);
  }

  hideElement(element) {
    element.classList.remove(this.#displayElementClass);
    element.classList.add(this.#hideElementClass);
  }

  displayPoints(points = 0) {
    this.pointsArea.textContent = points + " pkt.";
  }

  animatePoints(points) {
    const sign = points < 0 ? "" : "+";
    const elem = document.createElement("div");
    elem.classList.add("fadeIn_points");
    elem.classList.add("fadeIn");
    elem.textContent = `${sign} ${points}`;
    this.pointsArea.appendChild(elem);

    setTimeout(() => {
      elem.remove();
    }, 2000);
  }

  displayBonus(bonus = 0) {
    const bonusArea = document.querySelector(".stats-current_bonus");
    bonusArea.textContent = `Bonus: ${bonus === 0 ? "" : bonus}`;
  }

  displayNumberOfWins(num = 0, roundsToWin = 5) {
    const winsContainer = document.querySelector(".stats-wins");
    winsContainer.innerHTML = "";

    for (let i = 0; i < roundsToWin; i++) {
      const star = document.createElement("img");

      if (i < num) star.src = "assets/star.png";
      else star.src = "assets/empty_star.png";
      winsContainer.appendChild(star);
    }
  }

  dispalyHearts(heartsNumber) {
    const heartsDOM = document.querySelector(".hearts_container");
    heartsDOM.innerHTML = "";
    while (heartsNumber) {
      const heartElem = document.createElement("div");
      heartElem.classList.add("heart");
      heartElem.innerHTML = '<img src="assets/heart.png" alt="heart" />';
      heartsDOM.appendChild(heartElem);
      heartsNumber--;
    }
  }

  dispalyPlayersArea(names) {
    const playresNamesArea = document.querySelector(".players_container");
    playresNamesArea.textContent = "";

    names.forEach((name) => {
      const playerName = name.name;
      const namesElement = document.createElement("div");
      namesElement.classList.add("player");
      namesElement.textContent = playerName;
      playresNamesArea.appendChild(namesElement);
    });
  }

  classToActivePlayer(idx) {
    const players = [...document.querySelectorAll(".player")];
    players.forEach((elem) => elem.classList.remove("active"));
    players[idx].classList.add("active");
  }

  switchActiveAlphabet(type = "none", className = "active") {
    // vowel/ consonant
    this.alfpabet.all.forEach((elem) => elem.classList.remove("active"));
    if (type === "none") return;
    this.alfpabet[type].forEach((letter) => {
      if (!letter.classList.contains("clicked")) {
        // only if wasn't clicked
        letter.classList.add(className);
      }
    });
  }

  showButtons(buttonsNames) {
    //spinWheel/ buyVowel/ guessPassword/ all/ none
    let btns = [
      this.buttons.spinWheel,
      this.buttons.buyVowel,
      this.buttons.guessPassword,
    ];
    // reset
    btns.forEach((btn) => {
      btn.classList.remove("show_button");
    });

    if (buttonsNames === "none") return;
    if (buttonsNames === "all") {
      btns.forEach((btn) => {
        btn.classList.add("show_button");
      });
      return;
    }

    buttonsNames.forEach((name) => {
      this.buttons[name].classList.add("show_button");
    });
  }

  hideClickedLetter(letter) {
    let clickedNum = 0;
    this.alfpabet.all.forEach((elem) => {
      if (elem.textContent === letter) {
        elem.classList.add("clicked");
        clickedNum++;
      }
    });
  }

  hideAllCosonant() {
    this.alfpabet.consonant.forEach((elem) => elem.classList.add("clicked"));
  }

  resetAlphabet() {
    this.alfpabet.all.forEach((letter) => {
      letter.classList.remove("clicked");
      letter.classList.remove("active");
    });
  }
}
