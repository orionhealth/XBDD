package xbdd.persistence;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import xbdd.factory.MongoDBAccessor;
import xbdd.mappers.CoordinatesMapper;
import xbdd.mappers.FeatureMapper;
import xbdd.model.common.Stats;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddScenario;
import xbdd.util.Coordinates;
import xbdd.util.StatusHelper;
import xbdd.util.Statuses;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class StatsDao {

	private final MongoDBAccessor mongoDBAccessor;

	public StatsDao(final MongoDBAccessor mongoDBAccessor) {
		this.mongoDBAccessor = mongoDBAccessor;
	}

	public void updateStatsForFeatures(final Coordinates coordinates, final List<XbddFeature> features) {
		final MongoCollection<Stats> statsCollection = getStatsCollection();

		// product and version are redundant for search, but ensure they're populated if the upsert results in an insert.
		final String id = coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates.getBuild();
		statsCollection.deleteOne(Filters.eq(id));

		Stats newStats = new Stats();
		newStats.setCoordinates(CoordinatesMapper.mapCoordinates(coordinates));
		newStats.setId(id);
		newStats.setSummary(getNewStatsSummary());

		for (final XbddFeature xbddFeature : features) {
			if (xbddFeature.getElements() != null) {
				for (final XbddScenario scenario : xbddFeature.getElements()) {
					final List<String> stepStatuses = FeatureMapper.getStepStatusStream(scenario).collect(Collectors.toList());
					final String status =  StatusHelper.reduceStatuses(stepStatuses).getTextName();
					newStats.getSummary().replace(status, newStats.getSummary().get(status) + 1);
				}
			}
		}
		statsCollection.insertOne(newStats);
	}

	private MongoCollection<Stats> getStatsCollection() {
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase("bdd");
		return bdd.getCollection("reportStats", Stats.class);
	}

	private HashMap<String, Integer> getNewStatsSummary() {
		HashMap<String, Integer> summary = new HashMap<>();

		summary.put(Statuses.PASSED.getTextName(), 0);
		summary.put(Statuses.FAILED.getTextName(), 0);
		summary.put(Statuses.UNDEFINED.getTextName(), 0);
		summary.put(Statuses.SKIPPED.getTextName(), 0);
		summary.put(Statuses.UNKNOWN.getTextName(), 0);
		summary.put(Statuses.DONT_EXIST.getTextName(), 0);

		return summary;
	}
}
