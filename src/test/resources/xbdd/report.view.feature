@browser
Feature: View test results
  
  In order to prove a product can be released
  As a product maintainer
  I want to view the test results of a product

  Background:
    Given a test result has been uploaded
    And the user is logged in

  Scenario: View test results for a build
    When the user views the test report
    Then the product's features are displayed with test status

  Scenario: View test results for a feature
    When the user views the test report for a feature
    Then the feature's description is displayed
    And the feature's scenarios are displayed with test status

  Scenario: View test results for a scenario
    When the user views the test report for a scenario
    Then the scenario's steps are displayed with test status
    And the scenario's testing tips, environment and execution notes are displayed

  Scenario: View stack traces for the failed steps for a scenario
    When the user views the test report for a scenario with a failed step
    Then the stack traces for the scenario's failed step can be displayed

  Scenario: View test results for a manual scenario
    When the user views the test report for a manual scenario
    Then the scenario's steps are displayed with manual test status 
