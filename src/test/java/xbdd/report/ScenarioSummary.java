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

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.EqualsBuilder;

public class ScenarioSummary {

	private String name;
	private String description;
	private String result;
	private List<String> tags = new ArrayList<>();
	private List<StepSummary> background = new ArrayList<>();
	private List<StepSummary> steps = new ArrayList<>();
	private String executionNotes = "";
	private String environment = "";
	private String testingTips = "";

	public ScenarioSummary() {
	}

	public ScenarioSummary(final String name, final String description, final String result, final List<String> tags) {
		this.name = name;
		this.description = description;
		this.result = result;
		this.tags = tags;
	}

	public ScenarioSummary(final String name, final String description, final String result, final List<String> tags,
			final List<StepSummary> steps) {
		this(name, description, result, tags);
		this.steps = steps;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(final String description) {
		this.description = description;
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

	public List<StepSummary> getBackground() {
		return this.background;
	}

	public void setBackground(final List<StepSummary> background) {
		this.background = background;
	}

	public List<StepSummary> getSteps() {
		return this.steps;
	}

	public void setSteps(final List<StepSummary> steps) {
		this.steps = steps;
	}

	public String getExecutionNotes() {
		return this.executionNotes;
	}

	public void setExecutionNotes(final String executionNotes) {
		this.executionNotes = executionNotes;
	}

	public String getEnvironment() {
		return this.environment;
	}

	public void setEnvironment(final String environment) {
		this.environment = environment;
	}

	public String getTestingTips() {
		return this.testingTips;
	}

	public void setTestingTips(final String testingTips) {
		this.testingTips = testingTips;
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder()
				.append(this.background)
				.append(this.description)
				.append(this.environment)
				.append(this.executionNotes)
				.append(this.name)
				.append(this.result)
				.append(this.steps)
				.append(this.tags)
				.append(this.testingTips).toHashCode();
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
		final ScenarioSummary other = (ScenarioSummary) obj;
		return new EqualsBuilder()
				.append(this.background, other.background)
				.append(this.description, other.description)
				.append(this.environment, other.environment)
				.append(this.executionNotes, other.executionNotes)
				.append(this.name, other.name)
				.append(this.result, other.result)
				.append(this.steps, other.steps)
				.append(this.tags, other.tags)
				.append(this.testingTips, other.testingTips).isEquals();
	}

	@Override
	public String toString() {
		return "ScenarioSummary [name=" + this.name + ", description=" + this.description + ", result=" + this.result + ", tags="
				+ this.tags + ", background="
				+ this.background + ", steps=" + this.steps + "]";
	}

}
