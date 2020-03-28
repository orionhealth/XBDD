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
package io.github.orionhealth.xbdd.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.SimpleMongoClientDbFactory;

import com.mongodb.DB;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

/**
 * Wrapper for {@link MongoClient} that provides a central point for applying authentication to {@link DB} connections.
 */
public class MongoDBAccessor {

	@Autowired
	MongoClient mongoClient;

	private SimpleMongoClientDbFactory factory;
	private SimpleMongoClientDbFactory gridFactory;

	public MongoDatabase getDatabase() {
		initialiseIfNull();
		return this.factory.getDb();
	}

	@Deprecated
	public DB getDB() {
		initialiseIfNull();
		return this.factory.getLegacyDb();
	}

	@Deprecated
	public DB getGrid() {
		initialiseIfNull();
		return this.gridFactory.getLegacyDb();
	}

	private void initialiseIfNull() {
		if (this.factory == null || this.gridFactory == null) {
			this.factory = new SimpleMongoClientDbFactory(this.mongoClient, "bdd");
			this.gridFactory = new SimpleMongoClientDbFactory(this.mongoClient, "grid");
		}
	}
}
