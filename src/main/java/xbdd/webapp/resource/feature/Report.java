/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.webapp.resource.feature;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import xbdd.util.StatusHelper;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.Field;

import com.mongodb.AggregationOutput;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;
import com.mongodb.util.JSON;

@Path("/rest/reports")
public class Report {

	private final MongoDBAccessor client;

	@Inject
	public Report(final MongoDBAccessor client) {
		this.client = client;
	}

	Logger log = Logger.getLogger(Report.class);

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	public DBObject getReportByProductVersionId(@BeanParam final Coordinates coordinates,
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
			return featuresToReturn;
		} finally {
			cursor.close();
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Produces("application/json")
	public DBObject getSummaryOfAllReports(@Context final HttpServletRequest req) {
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

			return returns;
		} finally {
			cursor.close();
		}
	}

	@GET
	@Produces("application/json")
	@Path("/featureIndex/{product}/{major}.{minor}.{servicePack}/{build}")
	public DBObject getFeatureIndexForReport(@BeanParam final Coordinates coordinates,
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
		return featureIndex;
	}

	protected void embedTestingTips(final BasicDBList featureList, final Coordinates coordinates, final DB db) {
		for (final Object feature : featureList) {
			Feature.embedTestingTips((DBObject) feature, coordinates, db);
		}
	}

	protected String s4() {
		return Double.toHexString(Math.floor((1 + Math.random()) * 0x10000)).substring(1);
	}

	/**
	 * Generates a GUID
	 */
	protected String guid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	}

	/**
	 * go through all the embedded content, store it to GridFS, replace the doc embeddings with a hyperlink to the saved content.
	 */
	protected void embedSteps(final DBObject feature, final GridFS gridFS, final Coordinates coordinates) {
		final BasicDBList elements = (BasicDBList) feature.get("elements");
		final String featureId = (String) feature.get("_id");
		if (elements != null) {
			for (int j = 0; j < elements.size(); j++) {
				final DBObject scenario = (DBObject) elements.get(j);
				final String scenarioId = (String) scenario.get("_id");
				final BasicDBList steps = (BasicDBList) scenario.get("steps");
				if (steps != null) {
					for (int k = 0; k < steps.size(); k++) {
						final DBObject step = (DBObject) steps.get(k);
						final BasicDBList embeddings = (BasicDBList) step.get("embeddings");
						if (embeddings != null) {
							for (int l = 0; l < embeddings.size(); l++) {
								final DBObject embedding = (DBObject) embeddings.get(l);
								final GridFSInputFile image = gridFS
										.createFile(Base64.decodeBase64(((String) embedding.get("data")).getBytes()));
								image.setFilename(guid());
								final BasicDBObject metadata = new BasicDBObject().append("product", coordinates.getProduct())
										.append("major", coordinates.getMajor()).append("minor", coordinates.getMinor())
										.append("servicePack", coordinates.getServicePack()).append("build", coordinates.getBuild())
										.append("feature", featureId)
										.append("scenario", scenarioId);
								image.setMetaData(metadata);
								image.setContentType((String) embedding.get("mime_type"));
								image.save();
								embeddings.put(l, image.getFilename());
							}
						}
					}
				}
			}
		}
	}

	/**
	 * go through find all the backgrounds elements and nest them in their scenarios (simplifies application logic downstream)
	 */
	protected void packBackgroundsInToScenarios(final DBObject feature) {
		final List<DBObject> packedScenarios = new ArrayList<DBObject>();
		// go through all the backgrounds /scenarios
		final BasicDBList elements = (BasicDBList) feature.get("elements");
		if (elements != null) {
			for (int i = 0; i < elements.size(); i++) {
				final DBObject element = (DBObject) elements.get(i);
				if (element.get("type").equals("background")) { // if its a background
					((DBObject) elements.get(i + 1)).put("background", element); // push it in to the next element.
				} else {
					// assume this is a scenario/other top level element and push it to the packed array.
					packedScenarios.add(element);
				}
			}
			elements.clear();
			elements.addAll(packedScenarios);
		}
	}

	protected void updateSummaryDocument(final DB bdd, final Coordinates coordinates) {
		// product and version are redundant for search, but ensure they're populated if the upsert results in an insert.
		final DBObject summaryQuery = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString())
				.append("coordinates", coordinates.getObject(Field.PRODUCT, Field.VERSION));
		final DBCollection summary = bdd.getCollection("summary");
		final DBObject summaryObject = summary.findOne(summaryQuery);
		if (summaryObject != null) { // lookup the summary document
			@SuppressWarnings("unchecked")
			final List<String> buildArray = (List<String>) summaryObject.get("builds");
			if (!buildArray.contains(coordinates.getBuild())) { // only update it if this build hasn't been added to it before.
				// Update index document version.
				summary.update(summaryQuery,
						new BasicDBObject("$push", new BasicDBObject("builds", coordinates.getBuild())),
						true,
						false
						);
			}
		} else {// if the report doesn't already exist... then add it.
			summary.update(summaryQuery,
					new BasicDBObject("$push", new BasicDBObject("builds", coordinates.getBuild())),
					true,
					false
					);
		}
	}

	@GET
	@Produces("application/json")
	@Path("/tags/{product}/{major}.{minor}.{servicePack}/{build}")
	public DBObject getTagList(@BeanParam final Coordinates coordinates) {
		final DB bdd = this.client.getDB("bdd");
		final DBCollection features = bdd.getCollection("features");
		// Build objects for aggregation pipeline
		// id option: returns each tag with a list of associated feature ids
		final DBObject match = new BasicDBObject("$match", coordinates.getReportCoordinatesQueryObject());
		final DBObject fields = new BasicDBObject("tags.name", 1);
		fields.put("_id", 0); // comment out for id option
		final DBObject project = new BasicDBObject("$project", fields);
		final DBObject unwind = new BasicDBObject("$unwind", "$tags");
		final DBObject groupFields = new BasicDBObject("_id", "$tags.name");
		// groupFields.put("features", new BasicDBObject("$addToSet", "$_id")); //comment in for id option
		groupFields.put("amount", new BasicDBObject("$sum", 1));
		final DBObject group = new BasicDBObject("$group", groupFields);
		final DBObject sort = new BasicDBObject("$sort", new BasicDBObject("amount", -1));

		final AggregationOutput output = features.aggregate(match, project, unwind, group, sort);

		// get _ids from each entry of output.result
		final BasicDBList returns = new BasicDBList();
		for (final DBObject obj : output.results()) {
			final String id = obj.get("_id").toString();
			returns.add(id);
		}
		return returns;
	}

	protected void updateStatsDocument(final DB bdd, final Coordinates coordinates, final BasicDBList features) {
		// product and version are redundant for search, but ensure they're populated if the upsert results in an insert.
		final DBCollection statsCollection = bdd.getCollection("reportStats");
		final String id = coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates.getBuild();
		statsCollection.remove(new BasicDBObject("_id", id));
		final BasicDBObject stats = new BasicDBObject("coordinates", coordinates.getReportCoordinates());
		stats.put("_id", id);
		final BasicDBObject summary = new BasicDBObject();
		stats.put("summary", summary);
		final BasicDBObject feature = new BasicDBObject();
		stats.put("feature", feature);
		for (final Object ob : features) {
			final BasicDBList scenarios = (BasicDBList) ((DBObject) ob).get("elements");
			if (scenarios != null) {
				for (final Object o : scenarios) {
					final String status = StatusHelper.getFinalScenarioStatus((DBObject) o, false).getTextName();
					final Integer statusCounter = (Integer) summary.get(status);
					if (statusCounter == null) {
						summary.put(status, 1);
					} else {
						summary.put(status, statusCounter + 1);
					}
				}
			}
		}
		statsCollection.save(stats);
	}

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	public DBObject putReport(@BeanParam final Coordinates coordinates, final DBObject root) throws IOException {
		final BasicDBList doc = (BasicDBList) root;
		final DB grid = this.client.getDB("grid");
		final GridFS gridFS = new GridFS(grid);
		final DB bdd = this.client.getDB("bdd");
		final DBCollection features = bdd.getCollection("features");
		updateSummaryDocument(bdd, coordinates);

		for (int i = 0; i < doc.size(); i++) {
			// take each feature and give it a unique id.
			final DBObject feature = (DBObject) doc.get(i);
			final String _id = coordinates.getFeature_Id((String) feature.get("id"));
			feature.put("_id", _id);
			embedSteps(feature, gridFS, coordinates); // extract embedded content and hyperlink to it.
			packBackgroundsInToScenarios(feature); // nest background elements within their scenarios
			final BasicDBObject featureCo = coordinates.getReportCoordinates();
			feature.put("coordinates", featureCo);

			final BasicDBList newElements = mergeExistingScenarios(features, feature, _id);
			feature.put("elements", newElements);

			final String originalStatus = StatusHelper.getFeatureStatus(feature);
			feature.put("calculatedStatus", originalStatus);
			feature.put("originalAutomatedStatus", originalStatus);
			this.log.info("Saving: " + feature.get("name") + " - " + feature.get("calculatedStatus"));
			this.log.trace("Adding feature:" + JSON.serialize(feature));
			features.save(feature);
		}
		final DBCursor cursor = features.find(coordinates.getReportCoordinatesQueryObject()); // get new co-ordinates to exclude the "version"
																						// field
		final List<DBObject> returns = new ArrayList<DBObject>();
		try {
			while (cursor.hasNext()) {
				returns.add(cursor.next());
			}
		} finally {
			cursor.close();
		}
		final BasicDBList list = new BasicDBList();
		list.addAll(returns);
		updateStatsDocument(bdd, coordinates, list);
		return list;
	}

	private BasicDBList mergeExistingScenarios(final DBCollection features, final DBObject feature, final String _id) {
		BasicDBList newElements = (BasicDBList) feature.get("elements");
		if (newElements == null) {
			newElements = new BasicDBList();
		}
		final List<String> newElementIds = new ArrayList<String>();

		for (int k = 0; k < newElements.size(); k++) {
			final DBObject elem = (DBObject) newElements.get(k);
			final String elem_type = (String) elem.get("type");
			if (elem_type.equalsIgnoreCase("scenario")) {
				newElementIds.add((String) elem.get("id"));
			}
		}

		final DBObject existingFeature = features.findOne(_id);
		if (existingFeature != null) {
			final BasicDBList existingElements = (BasicDBList) existingFeature.get("elements");
			if (existingElements != null) {
				for (int j = 0; j < existingElements.size(); j++) {
					final DBObject element = (DBObject) existingElements.get(j);
					final String element_type = (String) element.get("type");
					if (element_type.equalsIgnoreCase("scenario")) {
						final String element_id = (String) element.get("id");
						if (!newElementIds.contains(element_id)) {
							newElements.add(element);
						}
					}
				}
			}

		}
		return newElements;
	}

	@POST
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(
			@BeanParam final Coordinates coord,
			@FormDataParam("file") final DBObject root,
			@FormDataParam("file") final FormDataContentDisposition fileDetail) throws IOException {
		putReport(coord, root);
		return Response.status(200).entity("success").build();

	}
}
