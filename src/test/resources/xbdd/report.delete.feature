Feature: Delete test reports
  
  In order to reduce unnecessary artefacts
  As a product maintainer
  I want to delete the test reports of a product

  Scenario: Delete test reports for a product
    Given the admin is logged in
    And a test result has been uploaded
    When the user deletes the test report
    Then the report for the product is no longer available

  Scenario: Users can not delete test reports
    Given the user is logged in
    And a test result has been uploaded
    Then the delete option is not visible
