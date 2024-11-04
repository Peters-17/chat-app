const { Before, After } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');

// store the WebDriver instance in a global variable
global.driver = null;

// create a new WebDriver instance before each scenario
Before(async function () {
  global.driver = new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:5000');
});

// close the WebDriver instance after each scenario
After(async function () {
  if (this.driver) {
    try {
      await this.driver.quit();
    } catch (error) {
      console.error("Error while quitting the driver:", error);
    }
  }
});
