const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
let expect;

(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

Given('I am logged in as a user', async function () {
  await driver.get('http://localhost:5000');
  await driver.findElement(By.id('loginUsername')).sendKeys('admin');
  await driver.findElement(By.id('loginPassword')).sendKeys('admin123');
  await driver.findElement(By.css('button[onclick="login()"]')).click();

  // Handle login success alert
  await driver.wait(until.alertIsPresent(), 5000);
  const alert = await driver.switchTo().alert();
  await alert.accept();
});

Given('a chat room exists named "TestRoom"', async function () {
  await driver.findElement(By.css('#roomInput')).sendKeys('TestRoom');
  await driver.findElement(By.id('room_add_icon_holder')).click();

  // Confirm room existence
  await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'room_card') and .//span[contains(text(), 'TestRoom')]]")), 5000);
});

When('I join a chat room', async function () {
  const roomListContainer = await driver.wait(until.elementLocated(By.css('.active_rooms_list')), 5000);
  await driver.wait(until.elementIsVisible(roomListContainer), 5000);

  const roomElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'room_card') and .//span[contains(text(), 'TestRoom')]]")), 5000);
  await driver.wait(until.elementIsVisible(roomElement), 5000);
  await roomElement.click();
});

Then('I should see the message history for that room', async function () {
  await driver.wait(until.elementsLocated(By.css('.message_holder')), 5000);
  const messages = await driver.findElements(By.css('.message_holder'));
  expect(messages.length).to.be.greaterThan(0);
});

When('I type a message into the message box', async function () {
  await driver.findElement(By.id('messageInput')).sendKeys('Hello, world!');
});

When('I click the send button', async function () {
  await driver.findElement(By.id('send_message_btn')).click();
});


Then('I should see my message in the chat window', async function () {
  const messages = await driver.wait(until.elementsLocated(By.css('.message_text')), 5000);
  const lastMessage = await messages[messages.length - 1].getText();
  expect(lastMessage).to.equal('Hello, world!');
});

