package io.github.orionhealth.xbdd.util;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import javax.ws.rs.PathParam;

public class Coordinates {

	private String product;
	private Integer major;
	private Integer minor;
	private Integer servicePack;
	private String build;

	public Coordinates() {
	}

	public Coordinates(final DBObject coordinates) {
		this.product = (String) coordinates.get("product");
		this.major = (Integer) coordinates.get("major");
		this.minor = (Integer) coordinates.get("minor");
		this.servicePack = (Integer) coordinates.get("servicePack");
		this.build = (String) coordinates.get("build");
	}

	public Coordinates(final String product, final Integer major, final Integer minor, final Integer servicePack, final String build) {
		this.product = product;
		this.major = major;
		this.minor = minor;
		this.servicePack = servicePack;
		this.build = build;
	}

	/**
	 * We only really want to order on URI, but prepending with the other co-ordinates allows the compound index that should exist for the
	 * purposes of lookup to be re-used for sorting.
	 */
	public static BasicDBObject getFeatureSortingObject() {
		return new BasicDBObject("coordinates.product", 1).append("coordinates.major", -1).append("coordinates.minor", -1)
				.append("coordinates.build", -1).append("uri", 1);
	}

	public String getProduct() {
		return this.product;
	}

	@PathParam("product")
	public void setProduct(final String product) {
		this.product = product;
	}

	public Integer getMajor() {
		return this.major;
	}

	@PathParam("major")
	public void setMajor(final Integer major) {
		this.major = major;
	}

	public Integer getMinor() {
		return this.minor;
	}

	@PathParam("minor")
	public void setMinor(final Integer minor) {
		this.minor = minor;
	}

	public Integer getServicePack() {
		return this.servicePack;
	}

	@PathParam("servicePack")
	public void setServicePack(final Integer servicePack) {
		this.servicePack = servicePack;
	}

	public String getBuild() {
		return this.build;
	}

	@PathParam("build")
	public void setBuild(final String build) {
		this.build = build;
	}

	public String getVersionString() {
		return this.major + "." + this.minor + "." + this.servicePack;
	}

	public BasicDBObject getProductCoordinates() {
		return new BasicDBObject().append("product", this.product);
	}

	public BasicDBObject getProductCoordinatesQueryObject() {
		return new BasicDBObject().append("coordinates.product", this.product);
	}

	public BasicDBObject getReportCoordinates() {
		return new BasicDBObject().append("product", this.product).append("major", this.major).append("minor", this.minor)
				.append("servicePack", this.servicePack)
				.append("build", this.build).append("version", getVersionString());
	}

	/**
	 * Query object that can be used to find a report (can't use the raw co-ordinates object as that would require a direct match of all
	 * fields inside co-ordinates and we only want to match a few fields.
	 */
	public BasicDBObject getReportCoordinatesQueryObject() {
		return new BasicDBObject().append("coordinates.product", this.product).append("coordinates.major", this.major)
				.append("coordinates.minor", this.minor)
				.append("coordinates.servicePack", this.servicePack).append("coordinates.build", this.build);
	}

	public BasicDBObject getQueryObject() {
		return new BasicDBObject().append("coordinates.product", this.product).append("coordinates.major", this.major)
				.append("coordinates.minor", this.minor)
				.append("coordinates.servicePack", this.servicePack).append("coordinates.build", this.build);
	}

	public BasicDBObject getTestingTipsCoordinates(final String featureId, final String scenarioId) {
		return getReportCoordinates().append("featureId", featureId).append("scenarioId", scenarioId);
	}

	public String getTestingTipsId(final String featureId, final String scenarioId) {
		return this.product + "/" + getVersionString() + "/" + getBuild() + "/" + featureId + "/" + scenarioId;
	}

	/**
	 * Query object that can be used to find a testing tip (can't use the raw co-ordinates object as that would require a direct match of
	 * all fields inside co-ordinates and we only want to match a few fields. We are looking for the tip for the current build or earlier.
	 */
	public BasicDBObject getTestingTipsCoordinatesQueryObject(final String featureId, final String scenarioId) {
		return new BasicDBObject().append("coordinates.product", this.product)
				.append("coordinates.major", new BasicDBObject("$lte", this.major))
				.append("coordinates.minor", new BasicDBObject("$lte", this.minor))
				.append("coordinates.servicePack", new BasicDBObject("$lte", this.servicePack))
				.append("coordinates.featureId", featureId)
				.append("coordinates.scenarioId", scenarioId);
	}

	public BasicDBObject getRollupCoordinates() {
		return new BasicDBObject().append("product", this.product).append("major", this.major).append("minor", this.minor)
				.append("servicePack", this.servicePack);
	}

	public BasicDBObject getRollupQueryObject(final String featureId) {
		return new BasicDBObject().append("coordinates.product", this.product).append("coordinates.major", this.major)
				.append("coordinates.minor", this.minor)
				.append("coordinates.servicePack", this.servicePack).append("id", featureId);
	}

	/**
	 * Takes in a feature id, and qualifies it in to an _id (prefixed with co-ordinates) "product/version/buiid/id"
	 */
	public String getFeature_Id(final String id) {
		return this.product + "/" + getVersionString() + "/" + getBuild() + "/" + id;
	}

	public BasicDBObject getQueryObject(final Field... fields) {
		final BasicDBObject o = new BasicDBObject();
		for (final Field f : fields) {
			switch (f) {
				case PRODUCT:
					o.append("coordinates.product", this.product);
					break;
				case MAJOR:
					o.append("coordinates.major", this.major);
					break;
				case MINOR:
					o.append("coordinates.minor", this.minor);
					break;
				case SERVICEPACK:
					o.append("coordinates.servicePack", this.servicePack);
					break;
				case VERSION:
					o.append("coordinates.major", this.major).append("coordinates.minor", this.minor)
							.append("coordinates.servicePack", this.servicePack);
					break;
				case VERSION_AS_STRING:
					o.append("coordinates.version", getVersionString());
					break;
				case BUILD:
					o.append("coordinates.build", this.build);
					break;
			}
		}
		return o;
	}

	/**
	 * Utility for creating DBObjects with coordinates. e.g. getObject(Field.PRODUCT,Field.BUILD); will return
	 * {"product":<product>,"build",<build>}
	 *
	 * @return a BasicDBOBject populated with the appropriate fields from this coordinate object.
	 */
	public BasicDBObject getObject(final Field... fields) {
		final BasicDBObject o = new BasicDBObject();
		for (final Field f : fields) {
			switch (f) {
				case PRODUCT:
					o.append("product", this.product);
					break;
				case MAJOR:
					o.append("major", this.major);
					break;
				case MINOR:
					o.append("minor", this.minor);
					break;
				case SERVICEPACK:
					o.append("servicePack", this.servicePack);
					break;
				case VERSION:
					o.append("major", this.major).append("minor", this.minor).append("servicePack", this.servicePack);
					break;
				case VERSION_AS_STRING:
					o.append("version", getVersionString());
					break;
				case BUILD:
					o.append("build", this.build);
					break;
			}
		}
		return o;
	}
}
