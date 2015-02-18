Feature: Passing background sample

  Example from https://github.com/cucumber/cucumber/blob/master/features/docs/gherkin

  Background:
    Given '10' cukes
    
  Scenario: passing background
    Then I should have '10' cukes    

  Scenario: another passing background
    Then I should have '10' cukes