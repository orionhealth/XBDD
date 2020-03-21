package xbdd.model.simple;

import java.util.List;

public class FeatureSummary {
	String _id;
	List<String> builds;

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public List<String> getBuilds() {
		return builds;
	}

	public void setBuilds(List<String> builds) {
		this.builds = builds;
	}
}
