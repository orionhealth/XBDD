package io.github.orionhealth.xbdd.resources;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.Statuses;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class QueryBuilder {

	private static QueryBuilder instance = new QueryBuilder();

	private QueryBuilder() {
	}

	public static QueryBuilder getInstance() {
		return instance;
	}

	public BasicDBObject getSearchQuery(final List<String> searchWords, final Coordinates coordinates, final String[] searchCategories) {
		final List<BasicDBObject> searchParameters = new ArrayList<>();
		for (int i = 0; i < searchWords.size(); i++) {
			String key = searchWords.get(i);
			if (!key.equals("")) {
				Pattern matchPattern;
				try {
					matchPattern = Pattern.compile(key, Pattern.CASE_INSENSITIVE);
				} catch (final PatternSyntaxException e) {
					key = Pattern.quote(key);
					searchWords.set(i, key);
					matchPattern = Pattern.compile(key);
				}
				for (final String searchCategory : searchCategories) {
					searchParameters.add(new BasicDBObject(searchCategory, matchPattern));
				}
			}
		}

		return coordinates.getQueryObject().append("$or", searchParameters);
	}

	public BasicDBObject buildFilterQuery(final Coordinates coordinates, final String searchText,
			final Integer viewPassed, final Integer viewFailed, final Integer viewUndefined,
			final Integer viewSkipped, final String start) {
		final BasicDBObject query = coordinates.getReportCoordinatesQueryObject();
		if (start != null) {
			query.put("uri", new BasicDBObject("$gt", start));
		}
		BasicDBList searchObject = null;
		if (StringUtils.isNotEmpty(searchText)) {
			final String[] searchTextArray = searchText.split("[\\s]+");
			searchObject = new BasicDBList();
			for (final String str : searchTextArray) {
				if (StringUtils.isNotEmpty(str)) {
					String key;
					if (str.charAt(0) == '@') {
						key = "tags.name";
					} else {
						key = "name";
					}
					searchObject.add(new BasicDBObject(key, Pattern.compile(".*" + str + ".*", Pattern.CASE_INSENSITIVE)));
				}
			}
		}

		final Map<String, DBObject> statuses = new HashMap<>();
		final String calculatedStatus = "calculatedStatus";
		statuses.put(Statuses.PASSED.getTextName(), new BasicDBObject(calculatedStatus, Statuses.PASSED.getTextName()));
		statuses.put(Statuses.FAILED.getTextName(), new BasicDBObject(calculatedStatus, Statuses.FAILED.getTextName()));
		statuses.put(Statuses.UNDEFINED.getTextName(), new BasicDBObject(calculatedStatus, Statuses.UNDEFINED.getTextName()));
		statuses.put(Statuses.SKIPPED.getTextName(), new BasicDBObject(calculatedStatus, Statuses.SKIPPED.getTextName()));

		if (viewPassed != null && viewPassed == 0) {
			statuses.remove(Statuses.PASSED.getTextName());
		}
		if (viewFailed != null && viewFailed == 0) {
			statuses.remove(Statuses.FAILED.getTextName());
		}
		if (viewSkipped != null && viewSkipped == 0) {
			statuses.remove(Statuses.SKIPPED.getTextName());
		}
		if (viewUndefined != null && viewUndefined == 0) {
			statuses.remove(Statuses.UNDEFINED.getTextName());
		}
		if (statuses.size() != 0) {
			final BasicDBList and = new BasicDBList();
			final BasicDBList or = new BasicDBList();
			or.addAll(statuses.values());
			if (searchObject != null) {
				and.add(new BasicDBObject("$and", searchObject));
				and.add(new BasicDBObject("$or", or));
				query.put("$and", and);
			} else {
				query.put("$or", or);
			}
		} else {
			query.put("$and", searchObject);
		}
		return query;
	}

	public List<DBObject> buildHasTagsQuery() {
		final List<DBObject> tagsQuery = new ArrayList<>();
		final DBObject tagsQueryObject = new BasicDBObject();
		final List<DBObject> orQuery = new ArrayList<>();
		final DBObject exist = new BasicDBObject("$exists", true);
		final DBObject featureTags = new BasicDBObject("tags", exist);
		final DBObject scenarioTags = new BasicDBObject("elements.tags", exist);
		orQuery.add(featureTags);
		orQuery.add(scenarioTags);
		tagsQueryObject.put("$or", orQuery);
		tagsQuery.add(tagsQueryObject);
		return tagsQuery;
	}
}
