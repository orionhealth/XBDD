package io.github.orionhealth.xbdd.persistence;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.model.common.TestingTips;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.TestingTipUtil;

@Repository
public class TestingTipsDao {

	@Autowired
	private MongoDatabase mongoBddDatabase;

	public Map<String, TestingTips> getLatestTestingTips(final Coordinates coordinates) {
		final MongoCollection<TestingTips> collection = getTestingTipsColletions();
		final Map<String, TestingTips> rtn = new HashMap<>();

		final Bson query = Filters.and(
				Filters.eq("coordinates.product", coordinates.getProduct()),
				Filters.lte("coordinates.major", coordinates.getMajor()),
				Filters.lte("coordinates.minor", coordinates.getMinor()),
				Filters.lte("coordinates.servicePack", coordinates.getServicePack()));

		final Consumer<TestingTips> addToRtn = tt -> {
			final String key = TestingTipUtil.getMapKey(tt);
			if (rtn.containsKey(key)) {
				rtn.put(key, getNewest(rtn.get(key), tt));
			} else {
				rtn.put(key, tt);
			}
		};

		collection.find(query, TestingTips.class).forEach(addToRtn);

		return rtn;
	}

	private TestingTips getNewest(final TestingTips tt1, final TestingTips tt2) {
		if (tt1.getCoordinates().getMajor() > tt2.getCoordinates().getMajor()) {
			return tt1;
		} else if (tt2.getCoordinates().getMajor() > tt1.getCoordinates().getMajor()) {
			return tt2;
		} else if (tt1.getCoordinates().getMinor() > tt2.getCoordinates().getMinor()) {
			return tt1;
		} else if (tt2.getCoordinates().getMinor() > tt1.getCoordinates().getMinor()) {
			return tt2;
		} else if (tt1.getCoordinates().getServicePack() > tt2.getCoordinates().getServicePack()) {
			return tt1;
		} else {
			return tt2;
		}
	}

	private MongoCollection<TestingTips> getTestingTipsColletions() {
		return this.mongoBddDatabase.getCollection("testingTips", TestingTips.class);
	}
}
