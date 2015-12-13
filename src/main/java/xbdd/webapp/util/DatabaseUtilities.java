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
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public final class DatabaseUtilities {
	private DatabaseUtilities() {

	}

	/**
	 * Collects the items available to the cursor into a list.
	 *
	 * @param cursor
	 * @return list of all items available to the cursor
	 */
	public static BasicDBList extractList(final DBCursor cursor) {
		final BasicDBList list = new BasicDBList();
		try {
			while (cursor.hasNext()) {
				list.add(cursor.next());
			}
		} finally {
			cursor.close();
		}
		return list;
	}

	/**
	 * Determines whether this scenario has a "@manual" tag in the Cucumber feature file.
	 *
	 * @param scenario
	 * @return true if this scenario is tagged "@manual"
	 */
	public static boolean scenarioHasTag(final DBObject scenario, final String tag) {
		boolean isManual = false;
		final BasicDBList tags = (BasicDBList) scenario.get("tags");
		if (tags != null) {
			for (final Object b : tags) {
				if (((BasicDBObject) b).get("name").equals(tag)) {
					isManual = true;
					break;
				}
			}
		}
		return isManual;
	}
}
