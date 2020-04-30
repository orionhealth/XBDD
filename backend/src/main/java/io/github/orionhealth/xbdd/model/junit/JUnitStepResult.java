package io.github.orionhealth.xbdd.model.junit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JUnitStepResult {
	private Long duration;
	private String error_message;
	private String status;

	public Long getDuration() {
		return this.duration;
	}

	public void setDuration(final Long duration) {
		this.duration = duration;
	}

	public String getError_message() {
		return this.error_message;
	}

	public void setError_message(final String error_message) {
		this.error_message = error_message;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(final String status) {
		this.status = status;
	}
}
