package io.github.orionhealth.xbdd.resources;

import com.mongodb.DBObject;
import org.apache.commons.lang.StringUtils;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.stream.Collectors;

/**
 * Matcher that compares two DBObjects by the number of times they match a set of regular expressions
 */
public class DBObjectComparator implements Comparator<DBObject> {

	final private ConcurrentMap<DBObject, Integer> cachedCounts = new ConcurrentHashMap<>();

	private Pattern pattern;

	/**
	 * Construct a {@link Comparator} with the given set of expressions
	 *
	 * @param searchExpressions a list of regular expressions
	 * @throws PatternSyntaxException if any of the expressions are not valid regex
	 */
	public DBObjectComparator(final Collection<String> searchExpressions) {
		final List<String> inputsForRegex = searchExpressions.stream().map(input -> "(" + input + ")").collect(Collectors.toList());
		final String regex = StringUtils.join(inputsForRegex, "|");
		this.pattern = Pattern.compile(regex);
	}

	@Override
	public int compare(final DBObject obj1, final DBObject obj2) {
		final int obj1Count = getCount(obj1);
		final int obj2Count = getCount(obj2);

		return obj2Count - obj1Count;
	}

	private int getCount(final DBObject obj) {
		int count;
		if (obj == null) {
			count = 0;
		} else if (this.cachedCounts.containsKey(obj)) {
			count = this.cachedCounts.get(obj);
		} else {
			count = countMatches(this.pattern.matcher(obj.toString()));
			this.cachedCounts.put(obj, count);
		}
		return count;
	}

	private int countMatches(final Matcher matcher) {
		int accumulator = 0;
		while (matcher.find()) {
			accumulator++;
		}
		return accumulator;
	}
}
