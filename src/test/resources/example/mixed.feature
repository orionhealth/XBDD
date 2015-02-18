@mixed
Feature: Merging reports for single feature

  Example feature containing three scenarios that are run by separate runners and merged in XBDD

  @one @two
  Scenario: scenario1
    Given A scenario
    
  @two
  Scenario: scenario2
    Given A failed scenario
    
  @one
  Scenario: scenario3
    Given A scenario