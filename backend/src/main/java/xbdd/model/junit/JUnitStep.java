package xbdd.model.junit;

import xbdd.model.common.StepMatch;

import java.util.List;

public class JUnitStep {
	private Integer line;
	private String name;
	private JUnitStepResult result;
	private StepMatch match;
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

	public StepMatch getMatch() {
		return match;
	}

	public void setMatch(StepMatch match) {
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
