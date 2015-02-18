/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.report;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class StepSummary {

	private String step;
	private String status;

	public StepSummary() {
	}

	public StepSummary(final String step, final String status) {
		this.step = step;
		this.status = status;
	}

	public String getStep() {
		return this.step;
	}

	public void setStep(final String step) {
		this.step = step;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(final String status) {
		this.status = status;
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder()
				.append(this.status)
				.append(this.step).toHashCode();
	}

	@Override
	public boolean equals(final Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		final StepSummary other = (StepSummary) obj;
		return new EqualsBuilder()
				.append(this.status, other.status)
				.append(this.step, other.step).isEquals();
	}

	@Override
	public String toString() {
		return "StepSummary [step=" + this.step + ", status=" + this.status + "]";
	}

}
