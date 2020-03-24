package xbdd.persistence;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.conversions.Bson;
import xbdd.factory.MongoDBAccessor;
import xbdd.mappers.CoordinatesMapper;
import xbdd.model.common.CoordinatesDto;
import xbdd.model.common.FeatureSummary;
import xbdd.util.Coordinates;

import java.util.ArrayList;

public class SummaryDao {

	private final MongoDBAccessor mongoDBAccessor;

	public SummaryDao(final MongoDBAccessor mongoDBAccessor) {
		this.mongoDBAccessor = mongoDBAccessor;
	}

	public void updateSummary(Coordinates coordinates) {
		final MongoCollection<FeatureSummary> summary = getSummaryCollection();

		final Bson query = Filters.eq(coordinates.getProduct() + "/" + coordinates.getVersionString());

		final FeatureSummary summaryObject = summary.find(query, FeatureSummary.class).first();

		if (summaryObject != null) { // lookup the summary document
			if (!summaryObject.getBuilds()
					.contains(coordinates.getBuild())) { // only update it if this build hasn't been added to it before.
				summaryObject.getBuilds().add(coordinates.getBuild());
				summary.replaceOne(query, summaryObject);
			}
		} else {
			FeatureSummary newSummary = new FeatureSummary();
			newSummary.setId(coordinates.getProduct() + "/" + coordinates.getVersionString());
			newSummary.setBuilds(new ArrayList<>());
			newSummary.getBuilds().add(coordinates.getBuild());

			// Summary's don't care about the build as they have a list of them.
			CoordinatesDto coordDto = CoordinatesMapper.mapCoordinates(coordinates);
			coordDto.setBuild(null);
			newSummary.setCoordinates(coordDto);

			summary.insertOne(newSummary);
		}
	}

	private MongoCollection<FeatureSummary> getSummaryCollection() {
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase("bdd");
		return bdd.getCollection("summary", FeatureSummary.class);
	}
}
