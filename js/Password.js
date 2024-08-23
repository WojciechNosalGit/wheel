class Password {
  constructor() {
    this.password = {};
  }

  async getDataPasswords() {
    try {
      const response = await fetch("data/passwords.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch the password data:", error);
    }
  }
}
