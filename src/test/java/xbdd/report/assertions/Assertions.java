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
package xbdd.report.assertions;

import xbdd.report.FeatureSummary;
import xbdd.report.ScenarioSummary;
import xbdd.report.StepSummary;

/**
 * Entry point for assertions of different data types. Each method in this class is a static factory for the type-specific assertion
 * objects.
 */
public class Assertions {

	/**
	 * Creates a new instance of <code>{@link xbdd.report.assertions.FeatureSummaryAssert}</code>.
	 *
	 * @param actual the actual value.
	 * @return the created assertion object.
	 */
	public static FeatureSummaryAssert assertThat(final FeatureSummary actual) {
		return new FeatureSummaryAssert(actual);
	}

	/**
	 * Creates a new instance of <code>{@link xbdd.report.assertions.ScenarioSummaryAssert}</code>.
	 *
	 * @param actual the actual value.
	 * @return the created assertion object.
	 */
	public static ScenarioSummaryAssert assertThat(final ScenarioSummary actual) {
		return new ScenarioSummaryAssert(actual);
	}

	/**
	 * Creates a new instance of <code>{@link xbdd.report.assertions.StepSummaryAssert}</code>.
	 *
	 * @param actual the actual value.
	 * @return the created assertion object.
	 */
	public static StepSummaryAssert assertThat(final StepSummary actual) {
		return new StepSummaryAssert(actual);
	}

	/**
	 * Creates a new <code>{@link Assertions}</code>.
	 */
	protected Assertions() {
		// empty
	}
}
