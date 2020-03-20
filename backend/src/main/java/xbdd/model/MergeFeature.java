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
package xbdd.model;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Merge Feature represents a Feature across multiple builds, containing a list all of the statuses for that feature in all previous builds
 * ordered most recent to least recent as well as a merged status as the first element of the list.
 */
public class MergeFeature {
	private String id;
	private String name;
	private List<MergeScenario> scenarios;
	private List<String> statuses;
	private String url;

	public String getId() {
		return this.id;
	}

	public MergeFeature setId(final String id) {
		this.id = id;
		return this;
	}

	public List<MergeScenario> getScenarios() {
		return this.scenarios;
	}

	public MergeFeature setScenarios(final List<MergeScenario> scenario) {
		this.scenarios = scenario;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public MergeFeature setName(final String name) {
		this.name = name;
		return this;
	}

	public List<String> getStatuses() {
		return this.statuses;
	}

	public void setStatuses(final List<String> statuses) {
		this.statuses = statuses;
	}

	public DBObject toDBObject() {
		final List<DBObject> scenarioList = new ArrayList<>();
		for (final MergeScenario scenario : this.scenarios) {
			scenarioList.add(scenario.toDBObject());
		}
		final DBObject returnObject = new BasicDBObject();
		returnObject.put("id", this.id);
		returnObject.put("name", this.name);
		returnObject.put("elements", scenarioList);
		returnObject.put("statuses", this.statuses);
		returnObject.put("url", this.url);
		return returnObject;
	}

	public void setUrl(final String url) {
		this.url = url;
	}
}
