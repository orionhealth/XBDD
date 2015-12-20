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
package xbdd.webapp.util;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public final class DatabaseUtilities {
	private DatabaseUtilities() {

	}

	/**
	 * Determines whether this scenario has a matching tag in the Cucumber 
	 * feature file. This method only inspects the direct tags of the subject, 
	 * so it will not find tags that have been inherited from a parent (e.g. 
	 * tags inherited from a feature by a scenario). 
	 *
	 * @param subject feature or scenario to inspect
	 * @param tag Cucumber tag to match e.g. "@manual"
	 * @return true if the subject is tagged with the specified tag
	 */
	public static boolean hasTag(final DBObject subject, final String tag) {
		boolean hasTag = false;
		final BasicDBList tags = (BasicDBList) subject.get("tags");
		if (tags != null) {
			for (final Object b : tags) {
				if (((BasicDBObject) b).get("name").equals(tag)) {
					hasTag = true;
					break;
				}
			}
		}
		return hasTag;
	}
}
