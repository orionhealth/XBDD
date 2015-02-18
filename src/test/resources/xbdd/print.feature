@manual @browser
Feature: Generate a printable report
  
  In order to record that a product is operating as intended
  As a product maintainer
  I want a report that details the test results of the product's features with scenarios in a format suitable for archiving and distributing

  Scenario: View the printable report
    Given a test result has been uploaded
    When I select the "Print preview in Web" option
    Then a printable version of the report is presented

  Scenario: The report can be downloaded as a pdf
    Given a test result has been uploaded
    And I have a report open
    When I select the "Download a PDF report" option
    Then a print friendly version of the report is downloaded as a pdf

  Scenario: The report can be customised to only include a subset of the features
    Given a test result has been uploaded
    When a custom report is generated for multiple features from that build
    Then only the selected features are included in the report
