Feature: Room Creation Uniqueness

  Scenario: Prevent duplicate room creation
    Given Room Uniqueness test User A is logged in as "userA" with password "passwordA"
    And Room Uniqueness test User A creates a chat room named "UniqueRoom"
    When Room Uniqueness test User A attempts to create another chat room named "UniqueRoom"
    Then there should be only one chat room named "UniqueRoom"
