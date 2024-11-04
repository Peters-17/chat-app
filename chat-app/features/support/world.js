const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');

// Define a custom world
class CustomWorld {
  constructor() {
    this.driver = new Builder().forBrowser('chrome').build();
  }

  async closeDriver() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}

setDefaultTimeout(10000);
setWorldConstructor(CustomWorld);
