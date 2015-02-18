@manual @browser
Feature: Verify whether a feature is operating as intended
  
  In order to prove that a feature works as intended
  As a tester
  I want to be able to see if a feature has passed, failed or requires manual execution
  
  False negative results from the the automated test run can be overridden by a human tester if it is found that the feature is operating as intended.

  Scenario Outline: Scenario status priority in determining overall feature status 
    Given a feature with three scenarios with status <scenario1>, <scenario2> and <scenario3>
    Then the feature status should be <outcome>
    
    Examples:
       | scenario1 | scenario2 | scenario3 | outcome   |
       | pass      | pass      | pass      | pass      |
       | undefined | pass      | pass      | undefined |
       | undefined | error     | pass      | error     |


  Scenario: Manually pass a feature
    Given a feature with a undefined test result
    When the all undefined scenarios for the feature are verified as passed by a tester
    Then the feature's test result is passed

  Scenario: Manually fail a feature
    Given a feature with an undefined test result
    When the at least one scenario is verified as failed by a tester
    Then the feature's test result is failed

  Scenario: Manually "Pass" a scenario
    Given a scenario with any test result
    When all steps in a scenario are verified as having passed by a tester
    Then the scenario's test result is passed
    
   Scenario: Partial manual execution of a scenario
   
    If someone only partly executes the steps for a scenario and hasn't failed any steps then it should still be Undefined.
   
    Given a scenario with any test result
    When any step in a scenario has had its result set to passed
    And not all other steps in the scenario have been set to passed
    And you don't have any step that has been marked as failed
    Then the scenario's test result is undefined

  Scenario: Manually "Fail" a scenario
  
    Intended to correct tests that may have incorrectly failed during automated testing.
    
    Given a scenario with any test result
    When a scenario has at least one failed step
    Then the scenario's test result is failed

  Scenario: View test results for manual test runs
    Given a test result has been uploaded
    When the user views the test report for a feature
    And the user executes manual test runs for all undefined scenarios
    Then the scenario's steps are displayed with test status
    And the feature's scenarios are displayed with test status
    And the feature has indications of result of manual test runs updated

  Scenario: Update information for a scenario
    Given a test result has been uploaded
    When the user views the test report for a scenario
    Then testing tips, environment and execution notes for the scenario can be updated by a tester
