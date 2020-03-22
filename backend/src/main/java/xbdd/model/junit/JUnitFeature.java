package xbdd.model.junit;

import xbdd.model.common.Tag;

import java.util.List;

public class JUnitFeature {
	private Integer line;
	private String name;
	private String description;
	private String id;
	private String keyword;
	private String uri;
	private List<JUnitElement> elements;
	private List<Tag> tags;

	public Integer getLine() {
		return line;
	}

	public void setLine(Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public List<JUnitElement> getElements() {
		return elements;
	}

	public void setElements(List<JUnitElement> elements) {
		this.elements = elements;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
}

/*
Example
{
    "line": 1,
    "name": "A basic cucumber example",
    "description": "\nExample from https://github.com/cucumber/cucumber/blob/master/features/docs/gherkin",
    "id": "a-basic-cucumber-example",
    "keyword": "Feature",
    "uri": "example/outline.feature",
    "elements": [
      {
        "line": 5,
        "name": "I have no steps",
        "description": "",
        "id": "a-basic-cucumber-example;i-have-no-steps",
        "type": "scenario",
        "keyword": "Scenario"
      },
      {
        "line": 12,
        "name": "Test state",
        "description": "",
        "id": "a-basic-cucumber-example;test-state;rainbow-colours;2",
        "type": "scenario",
        "keyword": "Scenario Outline",
        "steps": [
          {
            "result": {
              "status": "undefined"
            },
            "line": 8,
            "name": "missing without a table",
            "match": {},
            "matchedColumns": [
              0
            ],
            "keyword": "Given "
          },
          {
            "result": {
              "status": "undefined"
            },
            "line": 9,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              1
            ],
            "keyword": "Given "
          }
        ]
      },
      {
        "line": 13,
        "name": "Test state",
        "description": "",
        "id": "a-basic-cucumber-example;test-state;rainbow-colours;3",
        "type": "scenario",
        "keyword": "Scenario Outline",
        "steps": [
          {
            "result": {
              "status": "undefined"
            },
            "line": 8,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              0
            ],
            "keyword": "Given "
          },
          {
            "result": {
              "status": "undefined"
            },
            "line": 9,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              1
            ],
            "keyword": "Given "
          }
        ]
      },
      {
        "line": 14,
        "name": "Test state",
        "description": "",
        "id": "a-basic-cucumber-example;test-state;rainbow-colours;4",
        "type": "scenario",
        "keyword": "Scenario Outline",
        "steps": [
          {
            "result": {
              "status": "undefined"
            },
            "line": 8,
            "name": "failing without a table",
            "match": {},
            "matchedColumns": [
              0
            ],
            "keyword": "Given "
          },
          {
            "result": {
              "status": "undefined"
            },
            "line": 9,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              1
            ],
            "keyword": "Given "
          }
        ]
      },
      {
        "line": 17,
        "name": "Test state",
        "description": "",
        "id": "a-basic-cucumber-example;test-state;only-passing;2",
        "type": "scenario",
        "keyword": "Scenario Outline",
        "steps": [
          {
            "result": {
              "status": "undefined"
            },
            "line": 8,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              0
            ],
            "keyword": "Given "
          },
          {
            "result": {
              "status": "undefined"
            },
            "line": 9,
            "name": "passing without a table",
            "match": {},
            "matchedColumns": [
              1
            ],
            "keyword": "Given "
          }
        ]
      }
    ]
}
 */