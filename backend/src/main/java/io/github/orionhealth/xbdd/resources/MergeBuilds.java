package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.model.simple.Feature;
import io.github.orionhealth.xbdd.util.MultipleBuildsFeatureMergeHelper;

@Path("rest/reports/multiple")
public class MergeBuilds {

	@Autowired
	private DB mongoLegacyDb;

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public DBObject getMergedBuilds(final Merge merge) {
		// Get features collection
		final DBCollection collection = this.mongoLegacyDb.getCollection("features");

		// A list of all the features in every build, where features have only the attributes the client requires
		final List<Feature> featureList = new ArrayList<>();

		// query wrapper object
		final List<DBObject> or = new ArrayList<>();

		for (final String element : merge.builds) {
			final Pattern regex = Pattern.compile("^" + merge.product + "/" + merge.version + "/" + (element)
					+ "/");
			or.add(new BasicDBObject("_id", regex));
		}

		final DBCursor temp = collection.find(new BasicDBObject("$or", or), new BasicDBObject("id", 1).append("name", 1)
				.append("calculatedStatus", 1).append("elements", 1).append("coordinates", 1));
		final MultipleBuildsFeatureMergeHelper buildMerge = new MultipleBuildsFeatureMergeHelper(merge.builds);
		while (temp.hasNext()) {
			final Feature feature = new Feature((BasicDBObject) temp.next());
			if (feature.getCoordinates().getBuild().equals(merge.builds.get(0))) {
				featureList.add(feature);
			}
			buildMerge.addFeature(feature);
		}

		// returns object containing all features and scenarios from all builds and the merged build
		final DBObject buildObject = new BasicDBObject();
		final List<DBObject> resultList = new ArrayList<>();

		for (final Feature feature : featureList) {
			resultList.add(buildMerge.getMergeFeature(feature.getId()).toDBObject());
		}
		merge.builds.add(0, "Merged");
		buildObject.put("features", resultList);
		buildObject.put("builds", merge.builds);

		return buildObject;
	}

	public static class Merge {
		public List<String> builds;
		public String version;
		public String product;
	}
}
