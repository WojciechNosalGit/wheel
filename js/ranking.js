class Ranking {
  constructor() {
    this.soloRankDOM = document.getElementById("solo");
    this.multiRankDOM = document.getElementById("multi");
    this.rankingBtn = document.querySelector(".ranking");
    this.shutBtn = document.querySelector(".shut_ranking");
    this.windowRanking = document.getElementById("ranking");

    this.sound = new AudioControl();

    this.soloKey = "highScoresSolo";
    this.multiKey = "highScoresMultiplayer";
    this.maxScores = 8;
    this.currentMode = "solo"; // Default to solo mode

    this.switchMode("multi");
    this.initEvents();
  }

  initEvents() {
    this.soloRankDOM.addEventListener("click", (e) => {
      this.sound.play(this.sound.click);
      this.switchMode("solo");
    });

    this.multiRankDOM.addEventListener("click", () => {
      this.sound.play(this.sound.click);
      this.switchMode("multi");
    });

    this.rankingBtn.addEventListener("click", () => {
      this.sound.play(this.sound.click);
      this.windowRanking.classList.add("fadeIn_ranking");
    });

    this.shutBtn.addEventListener("click", () => {
      this.sound.play(this.sound.click);
      this.windowRanking.classList.remove("fadeIn_ranking");
    });
  }

  switchMode(mode) {
    this.currentMode = mode;
    this.renderHighScores();
    this.setActiveButton(mode);
  }

  setActiveButton(activeButtonId) {
    const buttons = document.querySelectorAll(".ranking-navigation div");
    const activeClass = "active_button";
    buttons.forEach((button) => button.classList.remove(activeClass));
    document.getElementById(activeButtonId).classList.add(activeClass);
  }

  saveHighScore(playerName, points, rounds = 0, isSolo = "false") {
    const newScore = { name: playerName, points, rounds };
    const storageKey = isSolo ? this.soloKey : this.multiKey;

    let highScores = JSON.parse(localStorage.getItem(storageKey)) || [];

    highScores.push(newScore);
    if (isSolo) {
      highScores.sort((a, b) => b.rounds - a.rounds);
    } else {
      highScores.sort((a, b) => b.points - a.points);
    }
    // highScores.sort((a, b) => b.points - a.points);
    highScores = highScores.slice(0, this.maxScores);
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(highScores));
    this.renderHighScores();
  }

  renderHighScores() {
    const storageKey =
      this.currentMode === "solo" ? this.soloKey : this.multiKey;
    const highScores = JSON.parse(localStorage.getItem(storageKey)) || [];

    const rankingList = document.querySelector(".ranking-list");

    // Clear the current list
    rankingList.innerHTML = "";

    // Add each high score to the ranking list
    highScores.forEach((score, index) => {
      const li = document.createElement("li");
      li.classList.add("ranking-item");

      const roundsMessage = score.rounds
        ? `<span class="rounds">Hasła: ${score.rounds}</span>`
        : "";

      li.innerHTML = `${index + 1}: <span class="name">${score.name}</span>
        <span class="points">${score.points}</span> pkt   ${roundsMessage}`;
      rankingList.appendChild(li);
    });
  }
}
