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
package xbdd.resources;

import com.mongodb.*;
import com.mongodb.client.MongoDatabase;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import xbdd.factory.MongoDBAccessor;
import xbdd.mappers.FeatureMapper;
import xbdd.model.junit.JUnitFeature;
import xbdd.model.xbdd.XbddFeature;
import xbdd.persistence.FeatureDao;
import xbdd.persistence.ImageDao;
import xbdd.persistence.StatsDao;
import xbdd.persistence.SummaryDao;
import xbdd.util.Coordinates;
import xbdd.util.SerializerUtil;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Path("/reports")
public class Report {

	private final MongoDBAccessor client;
	private final FeatureDao featureDao;
	private final ImageDao imageDao;
	private final SummaryDao summaryDao;
	private final StatsDao statsDao;

	@Inject
	public Report(final MongoDBAccessor client) {
		this.client = client;
		this.featureDao = new FeatureDao(client);
		this.imageDao = new ImageDao(client);
		this.summaryDao = new SummaryDao(client);
		this.statsDao = new StatsDao(client);
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReportByProductVersionId(@BeanParam final Coordinates coordinates,
			@QueryParam("searchText") final String searchText, @QueryParam("viewPassed") final Integer viewPassed,
			@QueryParam("viewFailed") final Integer viewFailed,
			@QueryParam("viewUndefined") final Integer viewUndefined, @QueryParam("viewSkipped") final Integer viewSkipped,
			@QueryParam("start") final String start, @QueryParam("limit") final Integer limit) {

		final BasicDBObject example = xbdd.resources.QueryBuilder.getInstance().buildFilterQuery(coordinates, searchText, viewPassed,
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

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putReport(@BeanParam final Coordinates coordinates, final List<JUnitFeature> root) {
		final MongoDatabase bdd = this.client.getDatabase("bdd");

		final FeatureMapper featureMapper = new FeatureMapper(this.imageDao);
		this.summaryDao.updateSummary(coordinates);

		List<XbddFeature> mappedFeatures = root.stream().map(feature -> featureMapper.map(feature, coordinates)).collect(Collectors.toList());
		this.featureDao.saveFeatures(mappedFeatures);

		List<XbddFeature> persistedFeatures = this.featureDao.getFeatures(coordinates);

		this.statsDao.updateStatsForFeatures(coordinates, persistedFeatures);

		return Response.ok(SerializerUtil.serialise(persistedFeatures)).build();
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
