Feature: Descriptions everywhere

  Example from https://github.com/cucumber/cucumber/blob/master/features/docs/gherkin

  We can put a useful description here of the feature, which can
  span multiple lines.

  Background:

    We can also put in descriptions showing what the background is
    doing.

    Given this step passes

  Scenario: I'm a scenario with a description

    You can also put descriptions in front of individual scenarios.

    Given this step passes

  Scenario Outline: I'm a scenario outline with a description

    Scenario outlines can have descriptions.

    Given this step <state>
    Examples: Examples

      Specific examples for an outline are allowed to have
      descriptions, too.

      |  state |
      | passes |