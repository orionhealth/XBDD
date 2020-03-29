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

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import java.util.function.Supplier;

import javax.inject.Singleton;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

/**
 * Factory for {@link MongoClient} that retrieves hostname and port parameters from the ServletContext. The {@link MongoClient} is designed
 * to be used a {@link Singleton}. <br>
 * To specify a hostname, port number, username and password for the mongo db connection you can add parameters
 * <code>sample_reports.mongo.hostname</code>, <code>sample_reports.monogo.port</code>, <code>sample_reports.monogo.username</code> and <code>sample_reports.monogo.password</code>.
 * The parameters are optional and will default to the mongo defaults {@link ServerAddress#defaultHost()} and
 * {@link ServerAddress#defaultPort()} respectively.
 */
public class ServletContextMongoClientFactory implements Supplier<MongoDBAccessor> {

	private static final Logger LOGGER = Logger.getLogger(ServletContextMongoClientFactory.class);
	
	@Autowired
	private Environment env;

	private MongoDBAccessor getMongoDBAccessor() {
		final String host = this.env.getProperty("xbdd.mongo.hostname");
		final String propPort = this.env.getProperty("xbdd.mongo.port");
		final String username = this.env.getProperty("xbdd.mongo.username");
		final String propPassword = this.env.getProperty("xbdd.mongo.password");
		
		LOGGER.info(String.format("Using mongo details: %s, %s, %s, %s.", host, propPort, username, propPassword));
		
		if (host == null || propPort == null || username == null || propPassword == null) {
			throw new RuntimeException("Mongo environment variables are not set.");
		}
		
		if (!NumberUtils.isNumber(propPort)) {
			throw new RuntimeException("Mongo port is not a number.");
		}

		final int port = Integer.parseInt(propPort);

		final char[] password = propPassword.toCharArray();

		final CodecRegistry pojoCodecRegistry = fromRegistries(MongoClient.getDefaultCodecRegistry(),
				fromProviders(PojoCodecProvider.builder().automatic(true).build()));
		final MongoClientOptions options = MongoClientOptions.builder().codecRegistry(pojoCodecRegistry).build();

		final MongoCredential credentials = MongoCredential.createScramSha1Credential(username, "admin", password);
		final MongoClient mc = new MongoClient(new ServerAddress(host, port), credentials, options);

		return new MongoDBAccessor(mc);
	}

	@Override
	public MongoDBAccessor get() {
		return getMongoDBAccessor();
	}

}
