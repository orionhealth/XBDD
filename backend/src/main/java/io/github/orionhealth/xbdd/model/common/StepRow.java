package io.github.orionhealth.xbdd.model.common;

import java.util.List;

public class StepRow {

	private Integer line;
	private List<String> cells;

	public Integer getLine() {
		return this.line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public List<String> getCells() {
		return this.cells;
	}

	public void setCells(final List<String> cells) {
		this.cells = cells;
	}

}
