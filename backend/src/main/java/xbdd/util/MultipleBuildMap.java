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
package xbdd.util;

import java.util.HashMap;
import java.util.Map;

/**
 * @param <T> Represents a scenario or feature over multiple builds
 */
public class MultipleBuildMap<T> {

	private final Map<String, T> map = new HashMap<String, T>();

	public T get(final String id, final String build) {
		final String key = keyOf(id, build);
		return this.map.containsKey(key) ? this.map.get(key) : null;
	}

	private String keyOf(final String id, final String build) {
		return id + build;
	}

	public MultipleBuildMap<T> put(final String id, final String build, final T obj) {
		this.map.put(keyOf(id, build), obj);
		return this;
	}

	public boolean isEmpty() {
		return this.map.isEmpty();
	}

	public boolean containsKey(final String id, final String build) {
		return this.map.containsKey(id + build);
	}
}
