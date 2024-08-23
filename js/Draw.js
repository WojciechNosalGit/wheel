class Draw {
  #passwordArea;
  constructor(numberOfLElems = 100) {
    this.#passwordArea = this.drawPasswordArea(numberOfLElems);
  }

  drawPasswordArea(num) {
    const passwordAreaContainer = document.getElementById("password_area");
    for (let i = 0; i < num; i++) {
      const div = document.createElement("div");
      div.classList.add("password_area-letter");
      div.dataset.id = i;
      passwordAreaContainer.appendChild(div);
    }
  }
}
