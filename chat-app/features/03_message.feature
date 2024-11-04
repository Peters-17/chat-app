Feature: Message Sending and History

  Scenario: Sending a message
    Given I am logged in as a user
    Given a chat room exists named "TestRoom"
    When I join a chat room
    And I type a message into the message box
    And I click the send button
    Then I should see my message in the chat window
