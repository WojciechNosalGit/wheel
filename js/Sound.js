class AudioControl {
  constructor() {
    this.click = document.getElementById("click_button");
    this.winRound = document.getElementById("win_round");
    this.wrongLetter = document.getElementById("wrong_letter");
    this.correctLetter = document.getElementById("correct_quess");
    this.spinWheel = document.getElementById("spin_wheel");
    this.gameOver = document.getElementById("game_over");
    this.onlyVowels = document.getElementById("only_vowels");
  }
  play(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
