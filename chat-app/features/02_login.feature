Feature: User Login

  Scenario: Successful login with correct credentials
    Given I am on the login page
    When I enter a valid username and password
    And I click the login button
    Then I should see the chat room interface

  Scenario: Unsuccessful login with incorrect credentials
    Given I am on the login page
    When I enter an invalid username or password
    And I click the login button
    Then I should see an error message
