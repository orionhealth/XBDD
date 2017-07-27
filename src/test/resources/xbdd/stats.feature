Feature: View results summary
  
  In order to coordinate testing effort
  As a product maintainer or a tester
  I want to access a summary of all test results

  Background:
    Given the user is logged in
    And a test result has been uploaded
    
  Scenario: Get summary stats for a build - legacy
    Then accurate summary stats are returned
    
  Scenario: Get summary stats for a build per feature
    Then accurate summary stats per feature are returned
    
  Scenario: Get summary stats for a build per scenario
    Then accurate summary stats per scenario are returned