package xbdd.model.junit;

import java.util.List;

public class JUnitStep {
	private Integer line;
	private String name;
	private JUnitStepResult result;
	private JUnitStepMatch match;
	private List<Integer> matchedColumns;
	private String keyword;
	private List<JUnitEmbedding> embeddings;

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

	public JUnitStepResult getResult() {
		return result;
	}

	public void setResult(JUnitStepResult result) {
		this.result = result;
	}

	public JUnitStepMatch getMatch() {
		return match;
	}

	public void setMatch(JUnitStepMatch match) {
		this.match = match;
	}

	public List<Integer> getMatchedColumns() {
		return matchedColumns;
	}

	public void setMatchedColumns(List<Integer> matchedColumns) {
		this.matchedColumns = matchedColumns;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public List<JUnitEmbedding> getEmbeddings() {
		return embeddings;
	}

	public void setEmbeddings(List<JUnitEmbedding> embeddings) {
		this.embeddings = embeddings;
	}
}

/*
Example
{
"result": {
  "duration": 2301689,
  "error_message": "java.lang.AssertionError\n\tat org.junit.Assert.fail(Assert.java:86)\n\tat org.junit.Assert.fail(Assert.java:95)\n\tat example.stepdefs.BasicStepdefs.this_step_fails(BasicStepdefs.java:31)\n\tat ✽.Given this step fails(example/failed.feature:4)\n",
  "status": "failed"
},
"line": 4,
"name": "this step fails",
"match": {
  "location": "BasicStepdefs.this_step_fails()"
},
"matchedColumns": [
  0
],
"keyword": "Given "
}
 */