package io.github.orionhealth.xbdd.model.xbdd;

import java.util.ArrayList;
import java.util.List;

import io.github.orionhealth.xbdd.model.common.StepMatch;

public class XbddStep {
	private Integer line;
	private String name;
	private XbddStepResult result;
	private StepMatch match;
	private List<Integer> matchedColumns;
	private String keyword;
	private List<String> embeddings;

	public Integer getLine() {
		return this.line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public XbddStepResult getResult() {
		return this.result;
	}

	public void setResult(final XbddStepResult result) {
		this.result = result;
	}

	public StepMatch getMatch() {
		return this.match;
	}

	public void setMatch(final StepMatch match) {
		this.match = match;
	}

	public List<Integer> getMatchedColumns() {
		if (this.matchedColumns == null) {
			this.matchedColumns = new ArrayList<Integer>();
		}
		return this.matchedColumns;
	}

	public void setMatchedColumns(final List<Integer> matchedColumns) {
		this.matchedColumns = matchedColumns;
	}

	public String getKeyword() {
		return this.keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public List<String> getEmbeddings() {
		if (this.embeddings == null) {
			this.embeddings = new ArrayList<String>();
		}
		return this.embeddings;
	}

	public void setEmbeddings(final List<String> embeddings) {
		this.embeddings = embeddings;
	}
}
