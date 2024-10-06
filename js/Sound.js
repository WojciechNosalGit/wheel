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
<<<<<<< HEAD
    this.wheelResult = document.getElementById("wheel_result");
    this.broke = document.getElementById("broke");
=======
>>>>>>> 1c9ce4a6a5a6da0d8e7878014fc42b60df6c3fb0
  }
  play(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
