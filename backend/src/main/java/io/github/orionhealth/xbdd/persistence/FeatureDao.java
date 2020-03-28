package io.github.orionhealth.xbdd.persistence;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import org.apache.commons.lang.StringUtils;
import org.bson.conversions.Bson;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.factory.MongoDBAccessor;
import io.github.orionhealth.xbdd.mappers.CoordinatesMapper;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeatureSummary;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;
import io.github.orionhealth.xbdd.util.Coordinates;

public class FeatureDao {
	private final MongoDBAccessor mongoDBAccessor;

	public FeatureDao() {
		this.mongoDBAccessor = new MongoDBAccessor();
	}

	public List<XbddFeatureSummary> getFeatureSummaries(final Coordinates coordinates) {
		final MongoCollection<XbddFeature> features = getFeatureCollection();
		final List<XbddFeatureSummary> summaries = new ArrayList<>();

		final Bson query = Filters.eq("coordinates", CoordinatesMapper.mapCoordinates(coordinates));
		final FindIterable<XbddFeatureSummary> savedFeatures = features.find(query, XbddFeatureSummary.class);

		final Consumer<XbddFeatureSummary> addToSummaries = summaries::add;
		savedFeatures.forEach(addToSummaries);

		return summaries;
	}

	public List<XbddFeature> getFeatures(final Coordinates coordinates) {
		final MongoCollection<XbddFeature> features = getFeatureCollection();

		final List<XbddFeature> extractedFeatures = new ArrayList<>();

		final Bson query = Filters.eq("coordinates", CoordinatesMapper.mapCoordinates(coordinates));
		final FindIterable<XbddFeature> savedFeatures = features.find(query, XbddFeature.class);

		final Consumer<XbddFeature> addToExtractedFeatures = feature -> extractedFeatures.add(feature);
		savedFeatures.forEach(addToExtractedFeatures);

		return extractedFeatures;
	}

	public void saveFeatures(final List<XbddFeature> xbddFeatures) {
		final MongoCollection<XbddFeature> existingFeatures = getFeatureCollection();

		for (final XbddFeature feature : xbddFeatures) {
			final Bson featureQuery = Filters.eq(feature.getId());
			final XbddFeature existing = existingFeatures.find(featureQuery).first();

			if (existing != null) {
				updateExistingScenarios(existing, feature);
				existingFeatures.replaceOne(featureQuery, existing);
			} else {
				existingFeatures.insertOne(feature);
			}
		}
	}

	private MongoCollection<XbddFeature> getFeatureCollection() {
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase();
		return bdd.getCollection("features", XbddFeature.class);
	}

	private void updateExistingScenarios(final XbddFeature existing, final XbddFeature newFeature) {
		for (final XbddScenario scenario : newFeature.getElements()) {
			if (existing.getElements().stream().noneMatch(old -> StringUtils.equals(old.getOriginalId(), scenario.getOriginalId()))) {
				existing.getElements().add(scenario);
			}
		}
	}
}
