package io.github.orionhealth.xbdd.util;

import java.util.HashMap;
import java.util.Map;

/**
 * @param <T> Represents a scenario or feature over multiple builds
 */
public class MultipleBuildMap<T> {

	private final Map<String, T> map = new HashMap<>();

	public T get(final String id, final String build) {
		final String key = keyOf(id, build);
		return this.map.getOrDefault(key, null);
	}

	private String keyOf(final String id, final String build) {
		return id + build;
	}

	public MultipleBuildMap<T> put(final String id, final String build, final T obj) {
		this.map.put(keyOf(id, build), obj);
		return this;
	}

	public boolean containsKey(final String id, final String build) {
		return this.map.containsKey(id + build);
	}
}
