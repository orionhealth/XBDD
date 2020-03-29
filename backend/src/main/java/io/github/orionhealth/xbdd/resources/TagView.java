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
package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/tagview")
public class TagView {

	@Autowired
	private DB mongoLegacyDb;

	private BasicDBList getTagList(final DBCursor results) {
		final Map<String, List<DBObject>> featureTagMapping = new HashMap<>();
		final List<String> tagList = new ArrayList<>();

		while (results.hasNext()) {
			final DBObject doc = results.next();
			for (final String tagName : getTags(doc)) {
				if (featureTagMapping.containsKey(tagName)) {
					featureTagMapping.get(tagName).add(doc);
				} else {
					final List<DBObject> value = new ArrayList<>();
					featureTagMapping.put(tagName, value);
					tagList.add(tagName);
					value.add(doc);
				}
			}
		}

		Collections.sort(tagList);
		final BasicDBList tagGroupList = new BasicDBList();

		for (final String tagName : tagList) {
			final DBObject tagContainerObject = new BasicDBObject();
			tagContainerObject.put("tag", tagName);
			tagContainerObject.put("features", featureTagMapping.get(tagName));
			tagGroupList.add(tagContainerObject);
		}

		return tagGroupList;
	}

	private List<String> getTags(final DBObject feature) {
		final List<String> tags = new ArrayList<>();
		final List<DBObject> featuretags = (List<DBObject>) feature.get("tags");
		if (featuretags != null) {
			for (final DBObject tag : featuretags) {
				final String tagName = (String) tag.get("name");
				if (!tags.contains(tagName)) {
					tags.add(tagName);
				}
			}
		}
		final List<DBObject> featureElements = (List<DBObject>) feature.get("elements");
		if (featureElements != null) {
			for (final DBObject element : featureElements) {
				final List<DBObject> elementtags = (List<DBObject>) element.get("tags");
				if (elementtags != null) {
					for (final DBObject tag : elementtags) {
						final String tagName = (String) tag.get("name");
						if (!tags.contains(tagName)) {
							tags.add(tagName);
						}
					}
				}
			}
		}
		return tags;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/featureTagIndex/{product}/{major}.{minor}.{servicePack}/{build}")
	public Response getFeatureTagIndexForReport(@BeanParam final Coordinates coordinates,
			@QueryParam("searchText") final String searchText, @QueryParam("viewPassed") final Integer viewPassed,
			@QueryParam("viewFailed") final Integer viewFailed,
			@QueryParam("viewUndefined") final Integer viewUndefined, @QueryParam("viewSkipped") final Integer viewSkipped,
			@QueryParam("start") final String start) {

		final DBCollection featuresCollection = this.mongoLegacyDb.getCollection("features");

		final BasicDBObject query = QueryBuilder.getInstance().buildFilterQuery(coordinates, searchText, viewPassed,
				viewFailed, viewUndefined, viewSkipped, start);

		query.append("$and", QueryBuilder.getInstance().buildHasTagsQuery());

		final DBCursor results = featuresCollection.find(query,
				new BasicDBObject("tags", 1).append("elements.tags", 1).append("name", 1).append("calculatedStatus", 1)
						.append("id", 1).append("elements.steps", 1).append("elements.name", 1).append("elements.id", 1));

		return Response.ok(SerializerUtil.serialise(getTagList(results))).build();
	}
}
