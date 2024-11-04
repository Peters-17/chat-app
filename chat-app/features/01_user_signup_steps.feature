Feature: User Signup

  Scenario: Sign up user with username "admin"
    Given I am on the signup page
    When I sign up with username "admin" and password "admin123"
    Then I should see a signup confirmation or user already exists alert

  Scenario: Sign up user with username "admin2"
    Given I am on the signup page
    When I sign up with username "admin2" and password "admin123"
    Then I should see a signup confirmation or user already exists alert