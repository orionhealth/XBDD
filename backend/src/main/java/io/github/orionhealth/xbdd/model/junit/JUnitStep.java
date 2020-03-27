package io.github.orionhealth.xbdd.model.junit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.github.orionhealth.xbdd.model.common.StepMatch;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
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

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public JUnitStepResult getResult() {
		return result;
	}

	public void setResult(final JUnitStepResult result) {
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

	public List<JUnitEmbedding> getEmbeddings() {
		return embeddings;
	}

	public void setEmbeddings(final List<JUnitEmbedding> embeddings) {
		this.embeddings = embeddings;
	}
}
