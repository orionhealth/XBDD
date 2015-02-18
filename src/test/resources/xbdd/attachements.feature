@manual @browser
Feature: View attachments for a scenario

  In order to verify UI and diagnoise failures
  As a tester
  I want to view the attachments from automated tests

  In order to provided evidence of manual tests passes
  As a tester
  I want to upload attachments for a scenario

  Scenario: View attachments from automated tests
    Given a test result has been uploaded with an embedded attachment
    When the user views the test report for a scenario
    Then the attachment is displayed

  Scenario: Upload attachments for a scneario
  	Given a test result has been uploaded
  	When the user views the test report for a scenario
  	And the user uploads an attachment for a scenario
  	Then the attachment is displayed