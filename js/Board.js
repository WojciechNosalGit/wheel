class Board {
  #board;
  #tempBoard;
  constructor() {
    this.DOMpasswordAreaContainer = document.querySelector(
      ".password_area-letters_wraper"
    );
    this.#board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.#tempBoard = this.#board.map((row) => row.map((cell) => 0));
    this.activeClass = "active";
    this.usedLetterClass = "used_letter";
  }

  drawEmptyPasswordArea() {
    this.DOMpasswordAreaContainer.textContent = "";

    this.#board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const div = document.createElement("div");
        div.classList.add("password_area-letter");
        div.dataset.x = i;
        div.dataset.y = j;
        this.DOMpasswordAreaContainer.appendChild(div);
      });
    });
  }

  displayText(text, display = false) {
    const words = text.split(" ");
    let rowIndex = 0;
    let colIndex = 0;
    const punctuation = [".", ",", "!", "?", ":", ";", "-", "'"];

    // Reset the board
    this.#board = this.#board.map((row) => row.map((cell) => 0));
    this.#tempBoard = this.#tempBoard.map((row) => row.map((cell) => 0));

    // Iterate over words and place them in the board
    for (let word of words) {
      if (colIndex + word.length > this.#board[rowIndex].length) {
        rowIndex++;
        colIndex = 0;
      }

      if (rowIndex >= this.#board.length) break;

      for (let char of word) {
        if (colIndex < this.#board[rowIndex].length) {
          this.#board[rowIndex][colIndex] = char;
          colIndex++;
        }
      }

      if (colIndex < this.#board[rowIndex].length) {
        this.#board[rowIndex][colIndex] = " ";
        colIndex++;
      }
    }

    // Update the DOM elements with the text
    this.#board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const div = this.DOMpasswordAreaContainer.querySelector(
          `[data-x='${i}'][data-y='${j}']`
        );

        div.classList.remove(this.activeClass);
        div.classList.remove("used_letter");

        // Check if the character is a punctuation mark
        if (punctuation.includes(cell)) {
          div.textContent = cell;
        } else if (cell !== 0 && cell !== " ") {
          if (display) {
            //show letters
            div.textContent = cell;
            div.classList.add("used_letter");
          } else {
            // just add class and do not show letters
            div.classList.add(this.activeClass);
          }
        } else {
          div.textContent = "";
        }
      });
    });
  }

  showLettersOnBoard(letter) {
    let count = 0;
    this.#board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) return;
        if (cell.toLowerCase() === letter.toLowerCase()) {
          const div = this.DOMpasswordAreaContainer.querySelector(
            `[data-x='${i}'][data-y='${j}']`
          );
          div.textContent = this.#board[i][j];
          div.classList.add("used_letter");
          //adding current letters from board to tempBoard array
          this.#tempBoard[i][j] = div.textContent;
          count++;
        }
      });
    });
    return count;
  }

  createDOMInputsForPlayers() {
    // row1 text
    this.displayText(" Wpiszcie imiona", true);

    this.#board.forEach((row, i) => {
      if (i === 0) return; //space for label
      row.forEach((cell, j) => {
        if (j > 13) return; // only 13 charts

        const div = this.DOMpasswordAreaContainer.querySelector(
          `[data-x='${i}'][data-y='${j}']`
        );

        //for numbers on the first cell in each row
        if (j === 0) return (div.textContent = i);

        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("maxlength", 1);
        input.classList.add("input");

        div.classList.add(this.activeClass);
        div.appendChild(input);
      });
    });
    this.setFocusOnInput();
  }

  setFocusOnInput = () => {
    const inputs = [
      ...document.querySelectorAll(".password_area-letter input"),
    ];

    inputs.forEach((input, i) => {
      inputs[0].focus(); //focus on first
      input.addEventListener("keyup", (e) => {
        const letter = e.target.value.toUpperCase();
        if (e.keyCode === 8 && i > 0) {
          //if backspace key and not start element

          inputs[i - 1].value = "";
          inputs[i - 1].focus();
        } else if (e.keyCode === 13) {
          //enter key
          const nexRow = i + 13;
          inputs[nexRow].focus();
        } else if (e.keyCode !== 8 && i < inputs.length - 1) {
          //otcher keys except backspace and enter
          inputs[i + 1].focus();
        }
      });
    });
  };

  getPlayersNames(row) {
    const names = [];

    const getNames = (row) => {
      const input = document.querySelectorAll(`div[data-x="${row}"] input`);
      const name = [];

      input.forEach((item) => {
        name.push(item.value);
      });
      if (name.join("").trim().toUpperCase()) {
        names.push(name.join("").trim().toUpperCase());
      }
    };
    for (let i = 1; i < 5; i++) {
      //four names
      getNames(i);
    }
    if (names.length === 0) names.push("Ukryty talent");
    return names;
  }

  getStringFromBoard() {
    const currentSentense = [];
    this.#board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) return;
        const div = this.DOMpasswordAreaContainer.querySelector(
          `[data-x='${i}'][data-y='${j}']`
        );
        if (div.textContent === " ") letters.push(" ");
        currentSentense.push(div.textContent);
      });
    });

    let str = "";
    currentSentense.forEach((letter) => {
      if (letter === "") str += " ";
      str += letter;
    });
    return str.trim();
  }

  changePasswordToInput() {
    const activeDIVs = [
      ...this.DOMpasswordAreaContainer.getElementsByClassName(this.activeClass),
    ];

    activeDIVs.forEach((elem) => {
      if (elem.textContent === " " || elem.textContent !== "") return;
      const input = document.createElement("input");
      input.classList.add("guessInput");
      input.setAttribute("type", "text");
      input.setAttribute("maxlength", 1);
      input.dataset.x = elem.dataset.x;
      input.dataset.y = elem.dataset.y;
      elem.appendChild(input);
    });
    this.setFocusOnInput();
  }

  isCorrectPassword() {
    const copyTempBoard = this.#tempBoard.map((row) => [...row]);

    copyTempBoard.forEach((row, i) => {
      row.forEach((cell, j) => {
        const input = this.DOMpasswordAreaContainer.querySelector(
          `.guessInput[data-x='${i}'][data-y='${j}']`
        );
        if (!input) return;
        copyTempBoard[i][j] = input.value;
      });
    });

    return this.comparePasswords(copyTempBoard);
  }

  comparePasswords(boardArr) {
    let correct = true;
    boardArr.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) return;
        if (cell !== this.#board[i][j]) correct = false;
        else if (correct === true) correct = true;
      });
    });
    return correct;
  }

  getPreviousBoard() {
    this.#board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) return;
        const div = this.DOMpasswordAreaContainer.querySelector(
          `div[data-x='${i}'][data-y='${j}']`
        );
        if (
          this.#tempBoard[i][j] === 0 &&
          div.classList.contains(this.activeClass)
        ) {
          div.innerHTML = "";
        }
      });
    });
  }

  animateBoard(className) {
    const active = [
      ...this.DOMpasswordAreaContainer.getElementsByClassName(this.activeClass),
    ];
    active.forEach((elem) => {
      // console.log(elem);
      elem.classList.add(className);
    });

    //remove class after time
    setTimeout(() => {
      active.forEach((elem) => {
        elem.classList.remove(className);
      });
    }, 2000);
  }
}
