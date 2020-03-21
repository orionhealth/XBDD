package xbdd.model.xbdd;

import java.util.List;

public class XbddStep {
	private Integer line;
	private String name;
	private XbddStepResult result;
	private XbddStepMatch match;
	private List<Integer> matchedColumns;
	private String keyword;
	private List<String> embeddings;

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

	public XbddStepResult getResult() {
		return result;
	}

	public void setResult(XbddStepResult result) {
		this.result = result;
	}

	public XbddStepMatch getMatch() {
		return match;
	}

	public void setMatch(XbddStepMatch match) {
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

	public List<String> getEmbeddings() {
		return embeddings;
	}

	public void setEmbeddings(List<String> embeddings) {
		this.embeddings = embeddings;
	}
}
