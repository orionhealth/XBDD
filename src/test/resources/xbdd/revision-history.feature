@manual
Feature: Track revision history

  In order trace manual verification of acceptance tests
  As a test engineer
  I want to know what changes have been made and who made them
  
  Scenario: Changes to status are records
    Given a test result has been uploaded
    When a step's status is modified
    Then the user name is recorded
    And the time of the modification is recorded
    And the change of the step's status is recorded
    And the change of the scenario's status is recorded 