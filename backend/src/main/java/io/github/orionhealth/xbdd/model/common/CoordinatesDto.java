package io.github.orionhealth.xbdd.model.common;

public class CoordinatesDto {
	private String product;
	private Integer major;
	private Integer minor;
	private Integer servicePack;
	private String build;

	public String getProduct() {
		return product;
	}

	public void setProduct(final String product) {
		this.product = product;
	}

	public Integer getMajor() {
		return major;
	}

	public void setMajor(final Integer major) {
		this.major = major;
	}

	public Integer getMinor() {
		return minor;
	}

	public void setMinor(final Integer minor) {
		this.minor = minor;
	}

	public Integer getServicePack() {
		return servicePack;
	}

	public void setServicePack(final Integer servicePack) {
		this.servicePack = servicePack;
	}

	public String getBuild() {
		return build;
	}

	public void setBuild(final String build) {
		this.build = build;
	}
}
