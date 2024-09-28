class Board {
  #board;
  #tempBoard;
  constructor() {
    this.DOMpasswordAreaContainer = document.querySelector(
      ".password_area-letters_wraper"
    );
    this.DOMCategory = document.querySelector(".password_area-category");
    this.vowels = ["a", "ą", "e", "ę", "i", "o", "u", "ó", "y"];

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

    this.nameSpaceLength = 9;
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

  displayText(text, display = false, row) {
    const words = text.split(" ");
    let rowIndex = row === 0 ? 0 : this.startRow(text);
    // let rowIndex = 0;
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

  startRow(text) {
    const length = text.length;
    if (length < 20) return 2;
    if (length >= 20 && length < 80) return 1;
    else return 0;
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

  showCategory(category, prefix = "Kategoria") {
    this.DOMCategory.textContent = `${prefix}: ${category}`;
  }

  createDOMInputsForPlayers() {
    // row1 text
    this.displayText(" Wpiszcie imiona", true, 0);

    this.#board.forEach((row, i) => {
      if (i === 0) return; //space for label
      row.forEach((cell, j) => {
        if (j > this.nameSpaceLength) return; // only 13 charts

        const div = this.DOMpasswordAreaContainer.querySelector(
          `[data-x='${i}'][data-y='${j}']`
        );

        //for numbers on the first cell in each row
        if (j === 0) {
          div.classList.add(this.usedLetterClass);
          div.textContent = i;
          return;
        }

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
    const inputs = [...document.querySelectorAll("input")];

    inputs[0].focus(); //focus on first
    inputs.forEach((input, i) => {
      // Handling input (letters, numbers, etc.)
      input.addEventListener("input", (e) => {
        // If a letter is entered, move focus to the next input (unless we're at the last one)
        if (e.inputType !== "deleteContentBackward" && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });

      // Handling special keys such as Backspace and Enter
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && i > 0) {
          // If Backspace is pressed and we are not at the first input, move focus backward
          e.preventDefault();

          if (i === inputs.length - 1 && inputs[i].value !== "") {
            // last element
            inputs[i].value = "";
            inputs[i].focus();
          } else {
            inputs[i - 1].value = ""; // Clear the previous input
            inputs[i - 1].focus(); // Move focus to the previous input
          }
        } else if (e.key === "Enter") {
          // If Enter is pressed, move to the next row
          e.preventDefault();
          const nextRow = () => {
            //Calculate the index of the next row
            if (i < this.nameSpaceLength) return this.nameSpaceLength;
            if (i < this.nameSpaceLength * 2) return this.nameSpaceLength * 2;
            if (i < this.nameSpaceLength * 3) return this.nameSpaceLength * 3;
          };

          if (nextRow() < inputs.length) {
            inputs[nextRow()].focus(); // Set focus to the first input in the next row
          }
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
    setTimeout(() => this.setFocusOnInput(), 0); // to make sure that DOM has fully loaded
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
        if (cell.toLowerCase() !== this.#board[i][j].toLowerCase())
          correct = false;
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

  areOnlyVowelsLeft() {
    for (let row = 0; row < this.#board.length; row++) {
      for (let col = 0; col < this.#board[row].length; col++) {
        const letter = this.#board[row][col];
        const tempLetter = this.#tempBoard[row][col]; // Odgadnięta litera

        // Sprawdźmy, czy to litera (string) i nie jest to spacja oraz nie została jeszcze odgadnięta
        if (typeof letter === "string" && letter !== " " && tempLetter === 0) {
          // Jeśli litera nie jest samogłoską, to nie wszystkie pozostałe są samogłoskami
          if (!this.vowels.includes(letter.toLowerCase())) {
            return false;
          }
        }
      }
    }
    // Jeśli nie znaleźliśmy żadnej nieodgadniętej spółgłoski, zwracamy true
    return true;
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
