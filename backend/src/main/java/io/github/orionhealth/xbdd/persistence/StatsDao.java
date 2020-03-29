package io.github.orionhealth.xbdd.persistence;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.mappers.CoordinatesMapper;
import io.github.orionhealth.xbdd.mappers.FeatureMapper;
import io.github.orionhealth.xbdd.model.common.Stats;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.StatusHelper;
import io.github.orionhealth.xbdd.util.Statuses;

@Repository
public class StatsDao {

	@Autowired
	private MongoDatabase mongoBddDatabase;

	public void updateStatsForFeatures(final Coordinates coordinates, final List<XbddFeature> features) {
		final MongoCollection<Stats> statsCollection = getStatsCollection();

		// product and version are redundant for search, but ensure they're populated if the upsert results in an insert.
		final String id = coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates.getBuild();
		statsCollection.deleteOne(Filters.eq(id));

		final Stats newStats = new Stats();
		newStats.setCoordinates(CoordinatesMapper.mapCoordinates(coordinates));
		newStats.setId(id);
		newStats.setSummary(getNewStatsSummary());

		for (final XbddFeature xbddFeature : features) {
			if (xbddFeature.getElements() != null) {
				for (final XbddScenario scenario : xbddFeature.getElements()) {
					final List<String> stepStatuses = FeatureMapper.getStepStatusStream(scenario).collect(Collectors.toList());
					final String status = StatusHelper.reduceStatuses(stepStatuses).getTextName();
					newStats.getSummary().replace(status, newStats.getSummary().get(status) + 1);
				}
			}
		}
		statsCollection.insertOne(newStats);
	}

	private MongoCollection<Stats> getStatsCollection() {
		return this.mongoBddDatabase.getCollection("reportStats", Stats.class);
	}

	private HashMap<String, Integer> getNewStatsSummary() {
		final HashMap<String, Integer> summary = new HashMap<>();

		summary.put(Statuses.PASSED.getTextName(), 0);
		summary.put(Statuses.FAILED.getTextName(), 0);
		summary.put(Statuses.UNDEFINED.getTextName(), 0);
		summary.put(Statuses.SKIPPED.getTextName(), 0);
		summary.put(Statuses.UNKNOWN.getTextName(), 0);
		summary.put(Statuses.DONT_EXIST.getTextName(), 0);

		return summary;
	}
}
