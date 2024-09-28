class AudioControl {
  constructor() {
    this.click = document.getElementById("click_button");
    this.winRound = document.getElementById("win_round");
    this.winGame = document.getElementById("win_game");
    this.wrongLetter = document.getElementById("wrong_letter");
    this.correctLetter = document.getElementById("correct_quess");
    this.spinWheel = document.getElementById("spin_wheel");
    this.gameOver = document.getElementById("game_over");
    this.onlyVowels = document.getElementById("only_vowels");
    this.wheelResult = document.getElementById("wheel_result");
    this.broke = document.getElementById("broke");
  }
  play(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
