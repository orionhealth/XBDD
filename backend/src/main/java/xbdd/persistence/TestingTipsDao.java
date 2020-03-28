package xbdd.persistence;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.conversions.Bson;
import xbdd.factory.MongoDBAccessor;
import xbdd.model.common.TestingTips;
import xbdd.util.Coordinates;
import xbdd.util.TestingTipUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

public class TestingTipsDao {

	private final MongoDBAccessor mongoDBAccessor;

	public TestingTipsDao(final MongoDBAccessor mongoDBAccessor) {
		this.mongoDBAccessor = mongoDBAccessor;
	}

	public Map<String, TestingTips> getLatestTestingTips(final Coordinates coordinates) {
		final MongoCollection<TestingTips> collection = getTestingTipsColletions();
		final Map<String, TestingTips> rtn = new HashMap<>();

		final Bson query = Filters.and(
				Filters.eq("coordinates.product", coordinates.getProduct()),
				Filters.lte("coordinates.major", coordinates.getMajor()),
				Filters.lte("coordinates.minor", coordinates.getMinor()),
				Filters.lte("coordinates.servicePack", coordinates.getServicePack())
		);

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
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase("bdd");
		return bdd.getCollection("testingTips", TestingTips.class);
	}
}
