package xbdd.model.xbdd;

public class XbddStepResult {
	private Long duration;
	private String error_message;
	private String status;
	private String manualStatus;

	public Long getDuration() {
		return duration;
	}

	public void setDuration(Long duration) {
		this.duration = duration;
	}

	public String getError_message() {
		return error_message;
	}

	public void setError_message(String error_message) {
		this.error_message = error_message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getManualStatus() {
		return manualStatus;
	}

	public void setManualStatus(String manualStatus) {
		this.manualStatus = manualStatus;
	}
}
