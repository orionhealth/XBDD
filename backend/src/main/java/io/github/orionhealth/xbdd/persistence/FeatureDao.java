package io.github.orionhealth.xbdd.persistence;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import org.apache.commons.lang.StringUtils;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.mappers.CoordinatesMapper;
import io.github.orionhealth.xbdd.mappers.FeatureMapper;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeatureSummary;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;
import io.github.orionhealth.xbdd.util.Coordinates;

@Repository
public class FeatureDao {

	@Autowired
	private MongoDatabase mongoBddDatabase;

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
				addExistingFeatures(existing, feature);
				FeatureMapper.setFeatureStatus(feature);
				existingFeatures.replaceOne(featureQuery, feature);
			} else {
				existingFeatures.insertOne(feature);
			}
		}
	}

	private MongoCollection<XbddFeature> getFeatureCollection() {
		return this.mongoBddDatabase.getCollection("features", XbddFeature.class);
	}

	private void addExistingFeatures(final XbddFeature existing, final XbddFeature newFeature) {
		for (final XbddScenario oldScenario : existing.getElements()) {
			if (newFeature.getElements().stream()
					.noneMatch(scenario -> StringUtils.equals(scenario.getOriginalId(), oldScenario.getOriginalId()))) {
				newFeature.getElements().add(oldScenario);
			}
		}
	}
}
