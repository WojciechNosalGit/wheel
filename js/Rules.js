const windowRules = document.getElementById("rules");
const sound = new AudioControl();

document.querySelector(".rules").addEventListener("click", () => {
  windowRules.classList.add("fadeIn_rules");
  sound.play(sound.click);
});

document.querySelector(".shut_rules").addEventListener("click", () => {
  windowRules.classList.remove("fadeIn_rules");
  sound.play(sound.click);
});
