Feature: Multi-User Chat Synchronization

  Scenario: Multiple users see each other's messages
    Given User A is logged in as "userA" with password "passwordA"
    And User B is logged in as "userB" with password "passwordB"
    And User A joins the chat room "general"
    And User B joins the chat room "general"
    When User A sends a message "Hello from User A!"
    Then User B should see "Hello from User A!" in the chat window
    And User A should see "Hello from User A!" in the chat window