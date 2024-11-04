const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  })();
let expect;

Given('User A is logged in as {string} with password {string}', async function (string, string2) {
    await driver.get('http://localhost:5000');
    await driver.findElement(By.id('loginUsername')).sendKeys('admin');
    await driver.findElement(By.id('loginPassword')).sendKeys('admin123');
    await driver.findElement(By.css('button[onclick="login()"]')).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept();
  });

Given('User B is logged in as {string} with password {string}', async function (string, string2) {
    await driver.get('http://localhost:5000');
    await driver.findElement(By.id('loginUsername')).sendKeys('admin2');
    await driver.findElement(By.id('loginPassword')).sendKeys('admin123');
    await driver.findElement(By.css('button[onclick="login()"]')).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept();
  });

Given('User A joins the chat room {string}', async function (string) {
    await driver.findElement(By.css('#roomInput')).sendKeys('general');
    await driver.findElement(By.id('room_add_icon_holder')).click();
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'room_card') and .//span[contains(text(), 'TestRoom')]]")), 5000);
  });

Given('User B joins the chat room {string}', async function (string) {
    await driver.findElement(By.css('#roomInput')).sendKeys('general');
    await driver.findElement(By.id('room_add_icon_holder')).click();
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'room_card') and .//span[contains(text(), 'TestRoom')]]")), 5000);
  });

When('User A sends a message {string}', async function (string) {
    await driver.findElement(By.id('messageInput')).sendKeys('Hello, world!');
    await driver.findElement(By.id('send_message_btn')).click();
  });

When('User B sends a message {string}', async function (string) {
    await driver.findElement(By.id('messageInput')).sendKeys('Hello, world!');
    await driver.findElement(By.id('send_message_btn')).click();
    });

Then('User B should see {string} in the chat window', async function (string) {
    await driver.wait(until.elementsLocated(By.css('.message_text')), 5000);
    const messages = await driver.findElements(By.css('.message_text'));
    const lastMessage = await messages[messages.length - 1].getText();
    expect(lastMessage).to.equal('Hello, world!');
    });

Then('User A should see {string} in the chat window', async function (string) {
    await driver.wait(until.elementsLocated(By.css('.message_text')), 5000);
    const messages = await driver.findElements(By.css('.message_text'));
    const lastMessage = await messages[messages.length - 1].getText();
    expect(lastMessage).to.equal('Hello, world!');
    });
