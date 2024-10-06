class Password {
  constructor() {
    this.password = () => this.#getPassword();
  }

  async #getPassword() {
    try {
      const response = await fetch("data/passwords.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const password = data[this.#randomNumber(data.length)];
      return password;
    } catch (error) {
      console.error("Failed to fetch the password data:", error);
    }
  }

  #randomNumber(max, min = 0) {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return 0;
  }
}
