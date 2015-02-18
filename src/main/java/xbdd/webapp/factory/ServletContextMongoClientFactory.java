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
package xbdd.webapp.factory;

import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Objects;

import javax.inject.Singleton;
import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

import org.apache.commons.lang.math.NumberUtils;
import org.glassfish.hk2.api.Factory;

import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

/**
 * Factory for {@link MongoClient} that retrieves hostname and port parameters from the ServletContext. The {@link MongoClient} is designed
 * to be used a {@link Singleton}. <br>
 * To specify a hostname, port number, username and password for the mongo db connection you can add parameters
 * <code>xbdd.mongo.hostname</code>, <code>xbdd.monogo.port</code>, <code>xbdd.monogo.username</code> and <code>xbdd.monogo.password</code>.
 * The parameters are optional and will default to the mongo defaults {@link ServerAddress#defaultHost()} and
 * {@link ServerAddress#defaultPort()} respectively.
 *
 */
public class ServletContextMongoClientFactory implements Factory<MongoDBAccessor> {

	private static final String XBDD_MONGO_HOSTNAME_INIT_PARAMETER = "xbdd.mongo.hostname";
	private static final String XBDD_MONGO_USERNAME_INIT_PARAMETER = "xbdd.mongo.username";
	private static final String XBDD_MONGO_PASSWORD_INIT_PARAMETER = "xbdd.mongo.password";
	private static final String XBDD_MONGO_PORT_INIT_PARAMETER = "xbdd.mongo.port";

	private final String host;
	private final int port;
	private final String username;
	private final char[] password;

	public ServletContextMongoClientFactory(@Context final ServletContext context) {
		this.host = Objects.toString(context.getInitParameter(XBDD_MONGO_HOSTNAME_INIT_PARAMETER), ServerAddress.defaultHost());
		this.username = context.getInitParameter(XBDD_MONGO_USERNAME_INIT_PARAMETER);
		this.password = context.getInitParameter(XBDD_MONGO_PASSWORD_INIT_PARAMETER) != null ?
				context.getInitParameter(XBDD_MONGO_PASSWORD_INIT_PARAMETER).toCharArray() : null;
		this.port = NumberUtils.isNumber(context.getInitParameter(XBDD_MONGO_PORT_INIT_PARAMETER)) ?
				Integer.parseInt(context.getInitParameter(XBDD_MONGO_PORT_INIT_PARAMETER)) : ServerAddress.defaultPort();
	}

	private MongoDBAccessor getMongoDBAccessor() throws UnknownHostException {
		final MongoClient mc;
		if (this.username != null) {
			MongoCredential credentials = MongoCredential.createMongoCRCredential(this.username, "admin", this.password);
			mc = new MongoClient(new ServerAddress(this.host, this.port), Arrays.asList(credentials));
		} else {
			mc = new MongoClient(this.host, this.port);
		}
		
		return new MongoDBAccessor(mc);
	}

	@Override
	public void dispose(final MongoDBAccessor client) {
		client.close();
	}

	@Override
	public MongoDBAccessor provide() {
		try {
			return getMongoDBAccessor();
		} catch (final UnknownHostException e) {
			throw new RuntimeException(e);
		}
	}

}
