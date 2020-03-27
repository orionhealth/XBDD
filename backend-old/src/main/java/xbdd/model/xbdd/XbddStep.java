package xbdd.model.xbdd;

import xbdd.model.common.StepMatch;

import java.util.List;

public class XbddStep {
	private Integer line;
	private String name;
	private XbddStepResult result;
	private StepMatch match;
	private List<Integer> matchedColumns;
	private String keyword;
	private List<String> embeddings;

	public Integer getLine() {
		return line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public XbddStepResult getResult() {
		return result;
	}

	public void setResult(final XbddStepResult result) {
		this.result = result;
	}

	public StepMatch getMatch() {
		return match;
	}

	public void setMatch(final StepMatch match) {
		this.match = match;
	}

	public List<Integer> getMatchedColumns() {
		return matchedColumns;
	}

	public void setMatchedColumns(final List<Integer> matchedColumns) {
		this.matchedColumns = matchedColumns;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public List<String> getEmbeddings() {
		return embeddings;
	}

	public void setEmbeddings(final List<String> embeddings) {
		this.embeddings = embeddings;
	}
}
