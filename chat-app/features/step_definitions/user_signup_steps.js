const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
let expect;

(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

Given('I am on the signup page', async function () {
  await driver.get('http://localhost:5000');
});

When('I sign up with username {string} and password {string}', async function (username, password) {
  await driver.findElement(By.id('signupUsername')).clear();
  await driver.findElement(By.id('signupUsername')).sendKeys(username);
  await driver.findElement(By.id('signupPassword')).clear();
  await driver.findElement(By.id('signupPassword')).sendKeys(password);
  await driver.findElement(By.css('button[onclick="signup()"]')).click();
});

Then('I should see a signup confirmation or user already exists alert', async function () {
  try {
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();

    if (alertText.includes('User already exists')) {
      expect(alertText).to.equal('User already exists');
    } else {
      expect(alertText).to.equal('User registered successfully');
    }
    await alert.accept();
  } catch (error) {
    throw new Error("Expected alert was not found or handled correctly");
  }
});
