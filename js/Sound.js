class AudioControl {
  constructor() {
    this.click = document.getElementById("click_button");
    this.winRound = document.getElementById("win_round");
    this.wrongLetter = document.getElementById("wrong_letter");
  }
  play(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
