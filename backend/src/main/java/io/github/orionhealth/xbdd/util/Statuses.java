package io.github.orionhealth.xbdd.util;

public enum Statuses {
	PASSED("passed"),
	FAILED("failed"),
	SKIPPED("skipped"),
	UNDEFINED("undefined"),
	DONT_EXIST("dont exist"),
	UNKNOWN("unknown status? - expected passed,failed or undefined");

	private String text;

	Statuses(final String text) {
		this.text = text;
	}

	public String getTextName() {
		return this.text;
	}
}
