/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
