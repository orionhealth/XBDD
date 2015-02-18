@browser
Feature: Upload results of an automatic test run
  
  In order to publish automated test results
  As a product maintainer
  I want to upload results of a cucumber test run

  Background:
  Given the user is logged in

  Scenario: Upload test report via REST service
    Given a cucumber json test report
    When the report is uploaded via REST
    Then the report can be viewed

  @manual
  Scenario: Upload test report from UI
    Given a cucumber json test report
    When the report is uploaded via the web UI
    Then the report can be viewed

  Scenario: A Feature report can be uploaded in multiple parts
    Given a cucumber feature
    And a cucumber json test report for the feature containing scenarios:
      | scenario1 |
      | scenario3 |
    And a cucumber json test report for the feature containing scenarios:
      | scenario1 |
      | scenario2 |
    When the reports are uploaded via REST
    Then the report can be viewed
    And the feature should have scenarios
      | scenario1 |
      | scenario2 |
      | scenario3 |

  Scenario: A Feature uploaded in multiple parts should calculate the correct feature status
    Given a scenario with undefined status
    And a cucumber json test report for the scenario with status passed
    When the report is uploaded via REST
    Then the scenario's status is updated to passed
