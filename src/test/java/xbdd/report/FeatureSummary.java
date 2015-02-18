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

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

/**
 * Represents a Feature Summary.
 */
public class FeatureSummary {

	private String title;
	private String result;
	private List<String> tags;
	private List<ScenarioSummary> scenarios = new ArrayList<>();
	private String description;

	public FeatureSummary() {
	}

	public FeatureSummary(final String title, final String result, final List<String> tags) {
		this.title = title;
		this.result = result;
		this.tags = tags;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(final String title) {
		this.title = title;
	}

	public String getResult() {
		return this.result;
	}

	public void setResult(final String result) {
		this.result = result;
	}

	public List<String> getTags() {
		return this.tags;
	}

	public void setTags(final List<String> tags) {
		this.tags = tags;
	}

	public List<ScenarioSummary> getScenarios() {
		return this.scenarios;
	}

	public void setScenarios(final List<ScenarioSummary> scenarios) {
		this.scenarios = scenarios;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder()
				.append(this.title)
				.append(this.result)
				.append(this.scenarios)
				.append(this.description)
				.append(this.tags).toHashCode();
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
		final FeatureSummary other = (FeatureSummary) obj;
		return new EqualsBuilder()
				.append(this.title, other.title)
				.append(this.result, other.result)
				.append(this.scenarios, other.scenarios)
				.append(this.description, other.description)
				.append(this.tags, other.tags).isEquals();
	}

	@Override
	public String toString() {
		return "FeatureSummary [title=" + this.title + ", result=" + this.result + ", tags=" + this.tags + ", scenarios=" + this.scenarios
				+ ", description=" + this.description + "]";
	}

}
