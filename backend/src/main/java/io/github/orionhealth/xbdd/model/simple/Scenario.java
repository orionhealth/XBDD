package io.github.orionhealth.xbdd.model.simple;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.BSONObject;

import java.util.Map;
import java.util.Set;

@Deprecated
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
