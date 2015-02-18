@browser
Feature: Access XBDD
  
  In order to use the functionality of XBDD
  As a product maintainer or a tester
  I want to have ability to access XBDD

  Scenario: Ability to access XBDD
    Given xbdd server is running
    Then the user can access xbdd

  Scenario: Prompted to enter user credentials
    Given xbdd server is running
    When the user enter correct credentials
    Then the user can login
  
  Scenario: Only authorized users must be able to login to XBDD
    Given xbdd server is running
    When the user enter wrong credentials
    Then the user cannot login

  @manual
  Scenario: Prompted to enter user credentials each time login to XBDD
    Given the user is logged in
    When the session expires
    Then the user is prompted to enter user credentials again

  @browser
  Scenario: Prompted to enter user credentials after logout
    Given the user is logged in
    When the user logs out
    Then the user is prompted to enter user credentials again

  Scenario: User can re login when session is expired and sends ajax request
    Given the user is logged in
    When the session is invalidated
    And the user attempts an ajax request
    Then a login dialog is displayed
    And the user can log in again
    And the user can make ajax requests
