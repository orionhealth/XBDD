/*
 * Copyright (c) Orchestral Developments Ltd and the Orion Health group of companies (2001 - 2020).
 *
 * This document is copyright. Except for the purpose of fair reviewing, no part
 * of this publication may be reproduced or transmitted in any form or by any
 * means, electronic or mechanical, including photocopying, recording, or any
 * information storage and retrieval system, without permission in writing from
 * the publisher. Infringers of copyright render themselves liable for
 * prosecution.
 */
package io.github.orionhealth.xbdd.config;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import org.apache.commons.lang.math.NumberUtils;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.SimpleMongoClientDbFactory;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

import com.mongodb.ConnectionString;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

	@Value("${spring.data.mongodb.host}")
	private String host;

	@Value("${spring.data.mongodb.port}")
	private String port;

	@Value("${spring.data.mongodb.username}")
	private String username;

	@Value("${spring.data.mongodb.password}")
	private String password;

	@Override
	protected String getDatabaseName() {
		return "bdd";
	}

	@Override
	@Bean
	public com.mongodb.client.MongoClient mongoClient() {
		final CodecRegistry pojoCodecRegistry = fromRegistries(MongoClient.getDefaultCodecRegistry(),
				fromProviders(PojoCodecProvider.builder().automatic(true).build()));

		final String connectionsString = String.format("mongodb://%s:%s@%s:%s", this.username, this.password, this.host, this.port);
		final MongoClientSettings settings = MongoClientSettings.builder()
				.codecRegistry(pojoCodecRegistry)
				.applyConnectionString(new ConnectionString(
						connectionsString))
				.build();

		return MongoClients.create(settings);
	}

	@Bean
	public MongoClient legacyMongoClient() {
		final CodecRegistry pojoCodecRegistry = fromRegistries(MongoClient.getDefaultCodecRegistry(),
				fromProviders(PojoCodecProvider.builder().automatic(true).build()));
		final MongoClientOptions options = MongoClientOptions.builder().codecRegistry(pojoCodecRegistry).build();

		final MongoCredential credentials = MongoCredential.createScramSha1Credential(this.username, "admin", this.password.toCharArray());
		return new MongoClient(new ServerAddress(this.host, NumberUtils.toInt(this.port)), credentials, options);
	}

	@Override
	@Bean
	public MongoDbFactory mongoDbFactory() {
		return new SimpleMongoClientDbFactory(mongoClient(), getDatabaseName());
	}

	@Bean(name = "mongoBddDatabase")
	public MongoDatabase mongoBddDatabase() {
		return mongoDbFactory().getDb();
	}

	@Deprecated
	@Bean(name = "mongoLegacyGrid")
	public DB mongoLegacyGrid() {
		return new SimpleMongoDbFactory(legacyMongoClient(), "grid").getLegacyDb();
	}

	@Deprecated
	@Bean(name = "mongoLegacyDb")
	public DB mongoLegacyDb() {
		return new SimpleMongoDbFactory(legacyMongoClient(), getDatabaseName()).getLegacyDb();
	}
}
