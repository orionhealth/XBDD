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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import xbdd.factory.MongoDBAccessor;
import xbdd.mappers.FeatureMapper;
import xbdd.model.common.Summary;
import xbdd.model.common.Tag;
import xbdd.model.common.TestingTips;
import xbdd.model.junit.JUnitFeature;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddFeatureSummary;
import xbdd.model.xbdd.XbddScenario;
import xbdd.persistence.*;
import xbdd.util.Coordinates;
import xbdd.util.TestingTipUtil;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

@Path("/reports")
public class Report {

	private final FeatureDao featureDao;
	private final ImageDao imageDao;
	private final SummaryDao summaryDao;
	private final StatsDao statsDao;
	private final UsersDao usersDao;
	private final TestingTipsDao testingTipsDao;

	@Inject
	public Report(final MongoDBAccessor client) {
		this.featureDao = new FeatureDao(client);
		this.imageDao = new ImageDao(client);
		this.summaryDao = new SummaryDao(client);
		this.statsDao = new StatsDao(client);
		this.usersDao = new UsersDao(client);
		this.testingTipsDao = new TestingTipsDao(client);
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReportByProductVersionId(@BeanParam final Coordinates coordinates) {
		final List<XbddFeature> features = this.featureDao.getFeatures(coordinates);
		final Map<String, TestingTips> testingTips = this.testingTipsDao.getLatestTestingTips(coordinates);

		for (final XbddFeature feature : features) {
			if (feature.getElements() != null) {
				for (final XbddScenario scenario : feature.getElements()) {
					final String tipKey = TestingTipUtil.getMapKey(feature, scenario);
					if (testingTips.containsKey(tipKey)) {
						scenario.setTestingTips(testingTips.get(tipKey).getTestingTips());
					}
				}
			}
		}

		return Response.ok(features).build();
	}

	@GET
	@Path("/summary")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSummaryOfAllReports(@Context final HttpServletRequest req) {
		// TODO this doesn't actually do anything atm as we dont have users but this is how you would use it
		final List<String> favourites = this.usersDao.getUserFavourites(req.getRemoteUser());
		final List<Summary> summaries = this.summaryDao.getSummaries();

		summaries.forEach(summary -> summary.setFavourite(favourites.contains(summary.getCoordinates().getProduct())));

		return Response.ok(summaries).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/featureIndex/{product}/{major}.{minor}.{servicePack}/{build}")
	public Response getFeatureIndexForReport(@BeanParam final Coordinates coordinates) {
		final List<XbddFeatureSummary> featureSummaries = this.featureDao.getFeatureSummaries(coordinates);
		return Response.ok(featureSummaries).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/tags/{product}/{major}.{minor}.{servicePack}/{build}")
	public Response getTagList(@BeanParam final Coordinates coordinates) {
		final List<XbddFeature> features = this.featureDao.getFeatures(coordinates);

		final Set<Tag> tags = new TreeSet<>(Comparator.comparing(Tag::getName));

		for (final XbddFeature feature : features) {
			if (feature.getTags() != null) {
				tags.addAll(feature.getTags());
			}

			if (feature.getElements() != null) {
				for (final XbddScenario scenario : feature.getElements()) {
					if (scenario.getTags() != null) {
						tags.addAll(scenario.getTags());
					}
				}
			}
		}

		return Response.ok(tags).build();
	}

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putReport(@BeanParam final Coordinates coordinates, final List<JUnitFeature> root) {
		final FeatureMapper featureMapper = new FeatureMapper(this.imageDao);
		this.summaryDao.updateSummary(coordinates);

		final List<XbddFeature> mappedFeatures = root.stream().map(feature -> featureMapper.map(feature, coordinates))
				.collect(Collectors.toList());
		this.featureDao.saveFeatures(mappedFeatures);

		final List<XbddFeature> persistedFeatures = this.featureDao.getFeatures(coordinates);

		this.statsDao.updateStatsForFeatures(coordinates, persistedFeatures);

		return Response.ok(persistedFeatures).build();
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
