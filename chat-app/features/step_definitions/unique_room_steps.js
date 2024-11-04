const { Given, When, Then, After } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');

(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();
let expect;

Given('Room Uniqueness test User A is logged in as {string} with password {string}', async function (string, string2) {
  await driver.get('http://localhost:5000');
  await driver.findElement(By.id('loginUsername')).sendKeys("admin");
  await driver.findElement(By.id('loginPassword')).sendKeys("admin123");
  await driver.findElement(By.css('button[onclick="login()"]')).click();

  await driver.wait(until.alertIsPresent(), 5000);
  const alert = await driver.switchTo().alert();
  await alert.accept();
});

Given('Room Uniqueness test User A creates a chat room named {string}', async function (String) {
  await driver.findElement(By.css('#roomInput')).sendKeys("UniqueRoom");
  await driver.findElement(By.id('room_add_icon_holder')).click();
});

When('Room Uniqueness test User A attempts to create another chat room named {string}', async function (String) {
  const roomInput = await driver.findElement(By.id('roomInput'));
  await roomInput.clear();
  await roomInput.sendKeys("UniqueRoom");
  await driver.findElement(By.id('room_add_icon_holder')).click();
});

Then('there should be only one chat room named {string}', async function (roomName) {
    const uniqueRooms = await driver.findElements(By.xpath(`//div[contains(@class, 'room_card') and .//span[contains(text(), '${roomName}')]]`));
    const roomCount = uniqueRooms.length;
    expect(roomCount).to.equal(1);
  });
  
After(async function () {
  if (driver) {
    await driver.quit();
  }
});
