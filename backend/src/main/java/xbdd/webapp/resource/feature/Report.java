/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.webapp.resource.feature;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.gridfs.GridFS;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.bson.conversions.Bson;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import xbdd.mappers.FeatureMapper;
import xbdd.model.junit.JUnitFeature;
import xbdd.model.simple.FeatureSummary;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddScenario;
import xbdd.util.StatusHelper;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.SerializerUtil;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Path("/reports")
public class Report {

	private final MongoDBAccessor client;
	Logger log = Logger.getLogger(Report.class);

	@Inject
	public Report(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReportByProductVersionId(@BeanParam final Coordinates coordinates,
			@QueryParam("searchText") final String searchText, @QueryParam("viewPassed") final Integer viewPassed,
			@QueryParam("viewFailed") final Integer viewFailed,
			@QueryParam("viewUndefined") final Integer viewUndefined, @QueryParam("viewSkipped") final Integer viewSkipped,
			@QueryParam("start") final String start, @QueryParam("limit") final Integer limit) {

		final BasicDBObject example = QueryBuilder.getInstance().buildFilterQuery(coordinates, searchText, viewPassed,
				viewFailed, viewUndefined, viewSkipped, start);

		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("features");
		final DBCursor cursor = collection.find(example).sort(Coordinates.getFeatureSortingObject());
		try {
			if (limit != null) {
				cursor.limit(limit);
			}
			final BasicDBList featuresToReturn = new BasicDBList();
			while (cursor.hasNext()) {
				featuresToReturn.add(cursor.next());
			}
			embedTestingTips(featuresToReturn, coordinates, db);
			return Response.ok(SerializerUtil.serialise(featuresToReturn)).build();
		} finally {
			cursor.close();
		}
	}

	@GET
	@Path("/summary")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSummaryOfAllReports(@Context final HttpServletRequest req) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBCollection usersCollection = db.getCollection("users");

		final BasicDBObject user = new BasicDBObject();
		user.put("user_id", req.getRemoteUser());

		final DBCursor userCursor = usersCollection.find(user);
		DBObject userFavourites;

		if (userCursor.count() != 1) {
			userFavourites = new BasicDBObject();
		} else {
			final DBObject uDoc = userCursor.next();
			if (uDoc.containsField("favourites")) {
				userFavourites = (DBObject) uDoc.get("favourites");
			} else {
				userFavourites = new BasicDBObject();
			}
		}

		final DBCursor cursor = collection.find();

		try {
			final BasicDBList returns = new BasicDBList();
			DBObject doc;

			while (cursor.hasNext()) {
				doc = cursor.next();
				final String product = ((String) ((DBObject) doc.get("coordinates")).get("product"));
				if (userFavourites.containsField(product)) {
					doc.put("favourite", userFavourites.get(product));
				} else {
					doc.put("favourite", false);
				}
				returns.add(doc);
			}

			return Response.ok(SerializerUtil.serialise(returns)).build();
		} finally {
			cursor.close();
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/featureIndex/{product}/{major}.{minor}.{servicePack}/{build}")
	public Response getFeatureIndexForReport(@BeanParam final Coordinates coordinates,
			@QueryParam("searchText") final String searchText, @QueryParam("viewPassed") final Integer viewPassed,
			@QueryParam("viewFailed") final Integer viewFailed,
			@QueryParam("viewUndefined") final Integer viewUndefined, @QueryParam("viewSkipped") final Integer viewSkipped,
			@QueryParam("start") final String start) {

		final BasicDBObject example = QueryBuilder.getInstance().buildFilterQuery(coordinates, searchText, viewPassed,
				viewFailed, viewUndefined, viewSkipped, start);
		final DB db = this.client.getDB("bdd");
		final DBCollection featuresCollection = db.getCollection("features");
		final DBCursor features = featuresCollection.find(example,
				new BasicDBObject("id", 1).append("name", 1).append("calculatedStatus", 1)
						.append("originalAutomatedStatus", 1).append("tags", 1).append("uri", 1))
				.sort(Coordinates.getFeatureSortingObject());
		final BasicDBList featureIndex = new BasicDBList();
		try {
			for (final Object o : features) {
				featureIndex.add(o);
			}
		} finally {
			features.close();
		}
		return Response.ok(SerializerUtil.serialise(featureIndex)).build();
	}

	protected void embedTestingTips(final BasicDBList featureList, final Coordinates coordinates, final DB db) {
		for (final Object feature : featureList) {
			Feature.embedTestingTips((DBObject) feature, coordinates, db);
		}
	}

	protected void updateSummaryDocument(final MongoDatabase bdd, final Coordinates coordinates) {
		final MongoCollection summary = bdd.getCollection("summary", FeatureSummary.class);
		final Bson query = Filters.eq("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		final FeatureSummary summaryObject = (FeatureSummary) summary.find(query, FeatureSummary.class).first();
		if (summaryObject != null) { // lookup the summary document
			if (!summaryObject.getBuilds().contains(coordinates.getBuild())) { // only update it if this build hasn't been added to it before.
				summaryObject.getBuilds().add(coordinates.getBuild());
				summary.replaceOne(query, summaryObject);
			}
		} else {
			FeatureSummary newSummary = new FeatureSummary();
			newSummary.set_id(coordinates.getProduct() + "/" + coordinates.getVersionString());
			newSummary.setBuilds(new ArrayList<>());
			newSummary.getBuilds().add(coordinates.getBuild());
			summary.insertOne(newSummary);
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/tags/{product}/{major}.{minor}.{servicePack}/{build}")
	public Response getTagList(@BeanParam final Coordinates coordinates) {
		final DB bdd = this.client.getDB("bdd");
		final DBCollection features = bdd.getCollection("features");
		List<BasicDBObject> objectList = new ArrayList<>();
		// Build objects for aggregation pipeline
		// id option: returns each tag with a list of associated feature ids
		objectList.add(new BasicDBObject("$match", coordinates.getReportCoordinatesQueryObject()));
		final DBObject fields = new BasicDBObject("tags.name", 1);
		fields.put("_id", 0); // comment out for id option
		objectList.add(new BasicDBObject("$project", fields));
		objectList.add(new BasicDBObject("$unwind", "$tags"));
		final DBObject groupFields = new BasicDBObject("_id", "$tags.name");
		// groupFields.put("features", new BasicDBObject("$addToSet", "$_id")); //comment in for id option
		groupFields.put("amount", new BasicDBObject("$sum", 1));
		objectList.add(new BasicDBObject("$group", groupFields));
		objectList.add(new BasicDBObject("$sort", new BasicDBObject("amount", -1)));

		AggregationOptions options = AggregationOptions.builder().build();

		final Cursor output = features.aggregate(objectList, options);

		// get _ids from each entry of output.result
		final BasicDBList returns = new BasicDBList();
		while (output.hasNext()) {
			returns.add(output.next().get("_id").toString());
		}
		return Response.ok(SerializerUtil.serialise(returns)).build();
	}

	protected void updateStatsDocument(final MongoDatabase bdd, final Coordinates coordinates, final List<XbddFeature> features) {
		// product and version are redundant for search, but ensure they're populated if the upsert results in an insert.
		final MongoCollection statsCollection = bdd.getCollection("reportStats");
		final String id = coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates.getBuild();
		statsCollection.deleteOne(new BasicDBObject("_id", id));
		final BasicDBObject stats = new BasicDBObject("coordinates", coordinates.getReportCoordinates());
		stats.put("_id", id);
		final BasicDBObject summary = new BasicDBObject();
		stats.put("summary", summary);
		final BasicDBObject feature = new BasicDBObject();
		stats.put("feature", feature);
		for (final XbddFeature xbddFeature : features) {
			if (xbddFeature.getElements() != null) {
				for (final XbddScenario scenario : xbddFeature.getElements()) {
					final List<String> stepStatuses = FeatureMapper.getStepStatusStream(scenario).collect(Collectors.toList());
					final String status =  StatusHelper.reduceStatuses(stepStatuses).getTextName();
					final Integer statusCounter = (Integer) summary.get(status);
					if (statusCounter == null) {
						summary.put(status, 1);
					} else {
						summary.put(status, statusCounter + 1);
					}
				}
			}
		}
		statsCollection.insertOne(stats);
	}

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putReport(@BeanParam final Coordinates coordinates, final List<JUnitFeature> root) {
		final DB grid = this.client.getDB("grid");
		final GridFS gridFS = new GridFS(grid);
		final MongoDatabase bdd = this.client.getDatabase("bdd");
		final MongoCollection<XbddFeature> features = bdd.getCollection("features", XbddFeature.class);
		final FeatureMapper featureMapper = new FeatureMapper(gridFS);
		updateSummaryDocument(bdd, coordinates);

		for (JUnitFeature feature : root) {
			final XbddFeature xbddFeature = featureMapper.map(feature, coordinates);
			Bson featureQuery = Filters.eq("_id", xbddFeature.getEffectiveId());
			final XbddFeature existing = features.find(featureQuery).first();

			if (existing != null) {
				updateExistingScenarios(existing, xbddFeature);
				features.replaceOne(featureQuery, existing);
			} else {
				features.insertOne(xbddFeature);
			}
		}
		final FindIterable<XbddFeature> savedFeatures = features
				.find(coordinates.getReportCoordinatesQueryObject(), XbddFeature.class); // get new co-ordinates to exclude the "version"
		// field

		final List<XbddFeature> returns = new ArrayList<>();
		Consumer<XbddFeature> addToReturns = feature -> returns.add(feature);

		savedFeatures.forEach(addToReturns);
		updateStatsDocument(bdd, coordinates, returns);
		return Response.ok(SerializerUtil.serialise(returns)).build();
	}

	private void updateExistingScenarios(final XbddFeature existing, final XbddFeature newFeature) {
		for(XbddScenario scenario: newFeature.getElements()) {
			if(existing.getElements().stream().noneMatch(old -> StringUtils.equals(old.getId(), scenario.getId()))) {
				existing.getElements().add(scenario);
			}
		}
	}

	@POST
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(
			@BeanParam final Coordinates coord,
			@FormDataParam("file") final List<JUnitFeature> root,
			@FormDataParam("file") final FormDataContentDisposition fileDetail) {
		putReport(coord, root);
		return Response.ok().build();

	}
}
