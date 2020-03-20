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
package xbdd.model.simple;

import com.mongodb.BasicDBObject;
import xbdd.webapp.util.Coordinates;

import java.util.ArrayList;
import java.util.List;

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
		final List<Scenario> scenarios = new ArrayList<Scenario>();
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
