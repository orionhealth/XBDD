Feature: Rename products
  
  In order to correct mistakes
  As a product maintainer
  I want to rename the product container of test reports

  Scenario: Rename a product
    Given the admin is logged in
    And a test result has been uploaded
    When the new name is set to an unique name
    And the client is an admin
    And a rename request is sent
    Then the request succeeds
    And all references to the old product are removed
    And references to the new product are added
 
  Scenario: Renaming a product to a name that already exists
    Given the admin is logged in
    And a test result has been uploaded
    And a test result has been uploaded
    When the new name is set to an already existing name
    And the client is an admin
    And a rename request is sent
    Then the request fails
    
  Scenario: Users can not rename a product
    Given the user is logged in
    And a test result has been uploaded
    When the new name is set to an unique name
    And the client is a user
    And a rename request is sent
    Then the request fails
