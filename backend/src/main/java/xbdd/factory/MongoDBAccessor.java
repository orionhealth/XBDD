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
package xbdd.factory;

import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

/**
 * Wrapper for {@link MongoClient} that provides a central point for applying authentication to {@link DB} connections.
 */
public class MongoDBAccessor {

	private final MongoClient client;

	public MongoDBAccessor(final MongoClient client) {
		this.client = client;
	}

	public MongoDatabase getDatabase(final String dbName) {
		return this.client.getDatabase(dbName);
	}

	public DB getDB(final String dbName) {
		return this.client.getDB(dbName);
	}
}
