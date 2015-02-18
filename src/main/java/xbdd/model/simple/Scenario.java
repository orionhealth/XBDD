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
package xbdd.model.simple;

import java.util.Map;
import java.util.Set;

import org.bson.BSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class Scenario implements DBObject {

	private final BasicDBObject scenarioObject;

	public Scenario(final BasicDBObject obj) {
		this.scenarioObject = obj;
	}

	public String getId() {
		return this.scenarioObject.getString("id");
	}

	public String getName() {
		return this.scenarioObject.getString("name");
	}

	// The following methods are for comparability with methods expecting dbObjects

	@Override
	public boolean containsField(final String arg0) {
		return this.scenarioObject.containsField(arg0);
	}

	@Override
	public boolean containsKey(final String arg0) {
		return this.scenarioObject.containsKey(arg0);
	}

	@Override
	public Object get(final String arg0) {
		return this.scenarioObject.get(arg0);
	}

	@Override
	public Set<String> keySet() {
		return this.scenarioObject.keySet();
	}

	@Override
	public Object put(final String arg0, final Object arg1) {
		return this.scenarioObject.put(arg0, arg1);
	}

	@Override
	public void putAll(final BSONObject arg0) {
		this.scenarioObject.putAll(arg0);
	}

	@Override
	public void putAll(final Map arg0) {
		this.scenarioObject.putAll(arg0);
	}

	@Override
	public Object removeField(final String arg0) {
		return this.scenarioObject.removeField(arg0);
	}

	@Override
	public Map toMap() {
		return this.scenarioObject.toMap();
	}

	@Override
	public boolean isPartialObject() {
		return this.scenarioObject.isPartialObject();
	}

	@Override
	public void markAsPartialObject() {
		this.scenarioObject.markAsPartialObject();
	}

}
