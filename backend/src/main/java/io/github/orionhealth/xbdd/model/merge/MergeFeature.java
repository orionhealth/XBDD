package io.github.orionhealth.xbdd.model.merge;

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
