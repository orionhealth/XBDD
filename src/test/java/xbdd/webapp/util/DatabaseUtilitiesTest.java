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

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

public class DatabaseUtilitiesTest {

	private BasicDBList report;

	@Before
	public void setup() throws FileNotFoundException {
		this.report = (BasicDBList) JSON.parse(readFile(new File("src/test/resources/xbdd/tag-test-report.json")));
	}

	private static String readFile(final File file) throws FileNotFoundException {
		final StringBuilder sb = new StringBuilder();
		try (final Scanner scanner = new Scanner(file)) {
			while (scanner.hasNextLine()) {
				sb.append(scanner.nextLine());
			}
		}
		return sb.toString();
	}

	@Test
	public void testFeatureTags() {
		final BasicDBObject untaggedFeature = (BasicDBObject) this.report.get(1);
		Assert.assertFalse(DatabaseUtilities.hasTag(untaggedFeature, "@such-test"));

		final BasicDBObject taggedFeature = (BasicDBObject) this.report.get(7);
		Assert.assertFalse(DatabaseUtilities.hasTag(taggedFeature, "@anti-tag"));
		Assert.assertTrue(DatabaseUtilities.hasTag(taggedFeature, "@such-test"));
		Assert.assertTrue(DatabaseUtilities.hasTag(taggedFeature, "@wow"));
	}

	@Test
	public void testScenarioTags() {
		final DBObject untaggedScenario = (DBObject) ((BasicDBList) ((BasicDBObject) this.report.get(0)).get("elements")).get(0);
		Assert.assertFalse(DatabaseUtilities.hasTag(untaggedScenario, "@much-automation"));

		final DBObject taggedScenario = (DBObject) ((BasicDBList) ((BasicDBObject) this.report.get(7)).get("elements")).get(0);
		Assert.assertFalse(DatabaseUtilities.hasTag(taggedScenario, "@anti-tag"));
		Assert.assertTrue(DatabaseUtilities.hasTag(taggedScenario, "@much-automation"));
	}
}