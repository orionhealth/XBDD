package io.github.orionhealth.xbdd.resources;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;

import io.github.orionhealth.xbdd.mappers.FeatureMapper;
import io.github.orionhealth.xbdd.model.common.Summary;
import io.github.orionhealth.xbdd.model.common.Tag;
import io.github.orionhealth.xbdd.model.common.TestingTips;
import io.github.orionhealth.xbdd.model.junit.JUnitFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeatureSummary;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;
import io.github.orionhealth.xbdd.persistence.FeatureDao;
import io.github.orionhealth.xbdd.persistence.ImageDao;
import io.github.orionhealth.xbdd.persistence.StatsDao;
import io.github.orionhealth.xbdd.persistence.SummaryDao;
import io.github.orionhealth.xbdd.persistence.TestingTipsDao;
import io.github.orionhealth.xbdd.persistence.UsersDao;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;
import io.github.orionhealth.xbdd.util.TestingTipUtil;

@Path("/reports")
public class Report {

	@Autowired
	private FeatureDao featureDao;

	@Autowired
	private ImageDao imageDao;

	@Autowired
	private SummaryDao summaryDao;

	@Autowired
	private StatsDao statsDao;

	@Autowired
	private UsersDao usersDao;

	@Autowired
	private TestingTipsDao testingTipsDao;

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
	public Response getSummaryOfAllReports() {
		// TODO this doesn't actually do anything atm as we dont have users but this is how you would use it
		final List<String> favourites = this.usersDao.getUserFavourites(LoggedInUserUtil.getLoggedInUser().getDisplay());
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
