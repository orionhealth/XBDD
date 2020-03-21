package xbdd.model.junit;

public class JUnitStepResult {
	private Integer duration;
	private String error_message;
	private String status;

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
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
}

/*
Example
{
  "duration": 2301689,
  "error_message": "java.lang.AssertionError\n\tat org.junit.Assert.fail(Assert.java:86)\n\tat org.junit.Assert.fail(Assert.java:95)\n\tat example.stepdefs.BasicStepdefs.this_step_fails(BasicStepdefs.java:31)\n\tat ✽.Given this step fails(example/failed.feature:4)\n",
  "status": "failed"
}
 */
