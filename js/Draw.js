class Draw {
  #password;
  #passwordArea;
  constructor() {
    this.#password = {
      text: "",
      category: "",
    };
    this.#passwordArea = [];
  }

  #createElement(selektor, className, iterator) {
    const element = document.createElement(selektor);
    element.classList.add(className);
    if (iterator !== "") element.dataset.id = iterator;
    return element;
  }

  drawEmptyPasswordArea() {
    const passwordAreaContainer = document.querySelector(
      ".password_area-letters_wraper"
    );
    this.#passwordArea = []; //reset
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 20; j++) {
        const div = this.#createElement("div", "password_area-letter");
        this.#passwordArea.push(div);
      }
    }
    passwordAreaContainer.innerHTML = ""; //reset
    this.#passwordArea.forEach((item, idx) => {
      item.dataset.id = idx;
      passwordAreaContainer.appendChild(item);
    });
  }

  displayHiddenPassword(password) {
    this.#password.text = password.text;
    this.#password.category = password.category;
    const categoryArea = document.querySelector(".password_area-category");
    categoryArea.classList.remove("display-none");
    categoryArea.textContent = `Kategoria: ${password.category}`;

    const words = this.#password.text.split(" ");
    this.#machWordsToArea(words);
  }

  #machWordsToArea(words) {
    let idx = 20; // index first squere
    let row = 1;
    words.forEach((word) => {
      //if there is no space to display full word
      if (word.length + idx > 20 * row) {
        idx = 20 * row;
        row++;
      }
      const wordArr = [...word, " "];
      for (let i = 0; i < wordArr.length; i++) {
        if (wordArr[i] === " ") return idx++; //make space at the and of the word
        this.#passwordArea[idx].classList.add("active"); //white squere
        this.#passwordArea[idx].dataset.letter = word[i];
        idx++;
      }
    });
  }

  showLetters(letter) {
    const indexes = [];

    const findIndexes = (letter) => {
      this.#passwordArea.forEach((elem) => {
        const datasetLetter = String(elem.dataset.letter).toUpperCase();

        if (datasetLetter === letter.toUpperCase()) {
          const idx = elem.dataset.id;
          indexes.push(idx);
        }
      });
      return indexes;
    };

    findIndexes(letter).forEach((index) => {
      this.#passwordArea[index].classList.add("used_letter");
      this.#passwordArea[index].textContent = letter;
    });
  }

  displayAddPlayer(labelString = "Podaj imiona graczy", className = "active") {
    const label = (labelString) => {
      let num = 0;
      [...labelString].forEach((el) => {
        if (el === " ") return num++;
        this.#passwordArea[num].classList.add(className);
        this.#passwordArea[num++].textContent = el;
      });
    };
    label(labelString);

    const createInput = () => {
      let start = 20;
      const drawInputArea = () => {
        for (let j = 1; j <= 4; j++) {
          for (let i = start * j; i < start * j + 13; i++) {
            const input = this.#createElement("input", "input", i);
            input.setAttribute("type", "text");
            input.setAttribute("maxlength", 1);
            input.dataset.row = j;
            const squere = this.#passwordArea[i];

            squere.classList.add(className);
            squere.appendChild(input);
          }
        }
      };
      drawInputArea();

      const setFocusOnInput = () => {
        const inputs = [
          ...document.querySelectorAll(".password_area-letter .input"),
        ];

        inputs.forEach((input, i) => {
          inputs[0].focus(); //focus on first
          input.addEventListener("keyup", (e) => {
            const letter = e.target.value.toUpperCase();
            if (e.keyCode === 8 && i > 0) {
              //if backspace and not start element

              inputs[i - 1].value = "";
              inputs[i - 1].focus();
            } else if (e.keyCode === 13) {
              console.log(inputs[i]);
            } else if (e.keyCode !== 8) {
              //otcher keys except backspace and enter
              inputs[i + 1].focus();
            }
          });
        });
      };
      setFocusOnInput();
    };
    createInput();
  }

  getPlayersNames(row) {
    const names = [];

    const getNames = (row) => {
      const input = document.querySelectorAll(`input[data-row="${row}"]`);
      const name = [];

      input.forEach((item) => {
        name.push(item.value);
      });
      if (name.join("").trim().toUpperCase()) {
        names.push(name.join("").trim().toUpperCase());
      }
    };
    for (let i = 1; i < 5; i++) {
      getNames(i);
    }
    if (names.length === 0) names.push("Ukryty talent");
    return names;
  }

  // ### add onclick on enter

  dispalyPlayersArea(names) {
    const playresNamesArea = document.querySelector(".players_container");

    names.forEach((name) => {
      const playerName = name.name;
      const namesElement = this.#createElement("div", "player");
      namesElement.textContent = playerName;
      playresNamesArea.appendChild(namesElement);
    });
  }

  displayPoints(points) {
    const pointsArea = document.querySelector(".stats-points");

    pointsArea.textContent = points + " punktów";
  }

  displayBonus(bonus) {
    const bonusArea = document.querySelector(".stats-current_bonus");
    bonusArea.textContent =
      bonus === 0 ? "Zakręć kołem" : "Aktywny bonus: " + bonus;
  }
}
