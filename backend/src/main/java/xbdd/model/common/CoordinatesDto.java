package xbdd.model.common;

public class CoordinatesDto {
	private String product;
	private Integer major;
	private Integer minor;
	private Integer servicePack;
	private String build;

	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	public Integer getMajor() {
		return major;
	}

	public void setMajor(Integer major) {
		this.major = major;
	}

	public Integer getMinor() {
		return minor;
	}

	public void setMinor(Integer minor) {
		this.minor = minor;
	}

	public Integer getServicePack() {
		return servicePack;
	}

	public void setServicePack(Integer servicePack) {
		this.servicePack = servicePack;
	}

	public String getBuild() {
		return build;
	}

	public void setBuild(String build) {
		this.build = build;
	}
}
