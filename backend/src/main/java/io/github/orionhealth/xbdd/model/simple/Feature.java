package io.github.orionhealth.xbdd.model.simple;

import com.mongodb.BasicDBObject;

import io.github.orionhealth.xbdd.util.Coordinates;

import java.util.ArrayList;
import java.util.List;

@Deprecated
public class Feature {

	private final BasicDBObject featureObject;

	public Feature(final BasicDBObject obj) {
		this.featureObject = obj;
	}

	public Coordinates getCoordinates() {
		return new Coordinates((BasicDBObject) this.featureObject.get("coordinates"));
	}

	public String getId() {
		return this.featureObject.getString("id");
	}

	public List<Scenario> getScenarios() {
		final List<Scenario> scenarios = new ArrayList<>();
		final List<BasicDBObject> elements = (ArrayList<BasicDBObject>) this.featureObject.get("elements");
		if (elements != null) {
			for (final BasicDBObject element : elements) {
				scenarios.add(new Scenario(element));
			}
		}
		return scenarios;
	}

	public String getName() {
		return this.featureObject.getString("name");
	}

	public String getCalculatedStatus() {
		return this.featureObject.getString("calculatedStatus");
	}
}
