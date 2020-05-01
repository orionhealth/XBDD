package io.github.orionhealth.xbdd.model.junit;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.github.orionhealth.xbdd.model.common.StepMatch;

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

	public JUnitStepResult getResult() {
		return this.result;
	}

	public void setResult(final JUnitStepResult result) {
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

	public List<JUnitEmbedding> getEmbeddings() {
		if (this.embeddings == null) {
			this.embeddings = new ArrayList<JUnitEmbedding>();
		}
		return this.embeddings;
	}

	public void setEmbeddings(final List<JUnitEmbedding> embeddings) {
		this.embeddings = embeddings;
	}
}
