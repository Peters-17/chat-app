const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');

let expect;

(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

Given('I am on the login page', async function () {
  await driver.get('http://localhost:5000');
});

When('I enter a valid username and password', async function () {
  await driver.findElement(By.id('loginUsername')).sendKeys('admin');
  await driver.findElement(By.id('loginPassword')).sendKeys('admin123');
});

When('I click the login button', async function () {
  await driver.findElement(By.css('button[onclick="login()"]')).click();
});

Then('I should see the chat room interface', async function () {
  // Wait and handle login success alert
  await driver.wait(until.alertIsPresent(), 5000);
  const alert = await driver.switchTo().alert();
  await alert.accept();

  // Ensure the chat area is displayed
  const chatArea = await driver.wait(until.elementLocated(By.className('chat_app')), 10000);
  await driver.wait(until.elementIsVisible(chatArea), 10000);
  expect(await chatArea.isDisplayed()).to.be.true;
});

When('I enter an invalid username or password', async function () {
  await driver.findElement(By.id('loginUsername')).sendKeys('wrongUser');
  await driver.findElement(By.id('loginPassword')).sendKeys('wrongPassword');
});

Then('I should see an error message', async function () {
  await driver.wait(until.alertIsPresent(), 5000);
  const alert = await driver.switchTo().alert();
  expect(await alert.getText()).to.equal('User not found');
  await alert.accept();
});
