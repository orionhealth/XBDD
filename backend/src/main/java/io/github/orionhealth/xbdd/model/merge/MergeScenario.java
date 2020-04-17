package io.github.orionhealth.xbdd.model.merge;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import java.util.List;

/**
 * Merge Scenario represents a Scenario across multiple builds, containing all of the statuses for that scenario in all previous builds
 * ordered most recent to least recent as well as a merged status as the first element of the list.
 */
public class MergeScenario {

	private String id;
	private String name;
	private List<String> statuses;

	public DBObject toDBObject() {
		final DBObject returnObject = new BasicDBObject();
		returnObject.put("id", this.id);
		returnObject.put("name", this.name);
		returnObject.put("statuses", this.statuses);
		return returnObject;
	}

	public MergeScenario setId(final String id) {
		this.id = id;
		return this;
	}

	public MergeScenario setName(final String name) {
		this.name = name;
		return this;
	}

	public List<String> getStatuses() {
		return this.statuses;
	}

	public MergeScenario setStatuses(final List<String> statuses) {
		this.statuses = statuses;
		return this;
	}

}
