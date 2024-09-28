class Ranking {
  constructor() {
    this.soloRankDOM = document.getElementById("solo");
    this.multiRankDOM = document.getElementById("multi");
    this.soloKey = "highScoresSolo";
    this.multiKey = "highScoresMultiplayer";
    this.maxScores = 8;
    this.currentMode = "solo"; // Default to solo mode

    this.switchMode("multi");
    this.initEvents();
  }

  initEvents() {
    this.soloRankDOM.addEventListener("click", (e) => {
      this.switchMode("solo");
    });

    this.multiRankDOM.addEventListener("click", () => {
      this.switchMode("multi");
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

  saveHighScore(playerName, points, isSolo = "false") {
    const newScore = { name: playerName, points };
    const storageKey = isSolo ? this.soloKey : this.multiKey;

    let highScores = JSON.parse(localStorage.getItem(storageKey)) || [];

    highScores.push(newScore);
    highScores.sort((a, b) => b.points - a.points);
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
      li.innerHTML = `${index + 1}: <span class="name">${score.name}</span>
        <span class="points">${score.points}</span> pkt`;
      rankingList.appendChild(li);
    });
  }
}

const rankingBtn = document.querySelector(".ranking");
const shutBtn = document.querySelector(".shut_window");

const windowRanking = document.getElementById("ranking");

rankingBtn.addEventListener("click", () => {
  windowRanking.classList.add("fadeIn_window");
});

shutBtn.addEventListener("click", () => {
  windowRanking.classList.remove("fadeIn_window");
});
