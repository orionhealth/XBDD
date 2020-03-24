package xbdd.persistence;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.apache.commons.lang.StringUtils;
import org.bson.conversions.Bson;
import xbdd.factory.MongoDBAccessor;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddScenario;
import xbdd.util.Coordinates;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class FeatureDao {
	private MongoDBAccessor mongoDBAccessor;

	public FeatureDao(final MongoDBAccessor mongoDBAccessor) {
		this.mongoDBAccessor = mongoDBAccessor;
	}

	public List<XbddFeature> getFeatures(Coordinates coordinates) {
		final MongoCollection<XbddFeature> features = getFeatureCollection();

		final List<XbddFeature> extractedFeatures = new ArrayList<>();

		final FindIterable<XbddFeature> savedFeatures = features
				.find(coordinates.getReportCoordinatesQueryObject(), XbddFeature.class);

		Consumer<XbddFeature> addToReturns = feature -> extractedFeatures.add(feature);
		savedFeatures.forEach(addToReturns);

		return extractedFeatures;
	}


	public void saveFeatures(List<XbddFeature> xbddFeatures) {
		final MongoCollection<XbddFeature> existingFeatures = getFeatureCollection();

		for (XbddFeature feature: xbddFeatures) {
			Bson featureQuery = Filters.eq(feature.getId());
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
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase("bdd");
		return bdd.getCollection("features", XbddFeature.class);
	}

	private void updateExistingScenarios(final XbddFeature existing, final XbddFeature newFeature) {
		for(XbddScenario scenario: newFeature.getElements()) {
			if(existing.getElements().stream().noneMatch(old -> StringUtils.equals(old.getOriginalId(), scenario.getOriginalId()))) {
				existing.getElements().add(scenario);
			}
		}
	}
}
