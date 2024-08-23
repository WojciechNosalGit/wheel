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
      ".password_area-container"
    );
    this.#passwordArea = []; //reset
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 20; j++) {
        const div = this.#createElement("div", "password_area-letter");
        // div.dataset.x = i;
        // div.dataset.y = j;
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
    console.log(password);
    this.#password.text = password.text;
    this.#password.category = password.category;
    const categoryArea = document.querySelector(".password_area-category");
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
    // const lettersArea = [...document.querySelectorAll(".password_area-letter")];

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
        for (let i = start; i < start + 13; i++) {
          const input = this.#createElement("input", "input", i - start);
          input.setAttribute("type", "text");
          input.setAttribute("maxlength", 1);
          const squere = this.#passwordArea[i];

          squere.classList.add(className);
          squere.appendChild(input);
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
            } else if (e.keyCode !== 8 && e.keyCode !== 13) {
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

  getPlayersNames() {
    const inputs = [
      ...document.querySelectorAll(".password_area-letter input"),
    ];
    const names = [];

    const getNames = () => {
      const name = [];

      inputs.forEach((item) => {
        name.push(item.value);
      });

      names.push(name.join("").trim().toUpperCase());
    };
    getNames();
    return names;
  }
}
