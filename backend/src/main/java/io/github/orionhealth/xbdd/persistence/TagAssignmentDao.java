package io.github.orionhealth.xbdd.persistence;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.mappers.CoordinatesMapper;
import io.github.orionhealth.xbdd.model.common.CoordinatesDto;
import io.github.orionhealth.xbdd.model.common.SingleTagAssignment;
import io.github.orionhealth.xbdd.model.common.TagAssignments;
import io.github.orionhealth.xbdd.util.Coordinates;

@Repository
public class TagAssignmentDao {
	@Autowired
	private MongoDatabase mongoBddDatabase;

	public List<SingleTagAssignment> getTagAssignments(final Coordinates coordinates) {
		final MongoCollection<TagAssignments> tagAssignments = getTagAssignmentColletions();
		final Bson query = Filters.eq("coordinates", CoordinatesMapper.mapCoordinates(coordinates));

		final TagAssignments savedAssignments = tagAssignments.find(query).first();

		if (savedAssignments != null) {
			return savedAssignments.getTags();
		}

		return Collections.emptyList();
	}

	public void saveTagAssignment(final Coordinates coordinates, final SingleTagAssignment singleTagAssignment) {
		final MongoCollection<TagAssignments> tagAssignments = getTagAssignmentColletions();
		final CoordinatesDto coordinatesDto = CoordinatesMapper.mapCoordinates(coordinates);
		final Bson query = Filters.eq("coordinates", coordinatesDto);

		final TagAssignments savedAssignments = tagAssignments.find(query).first();

		if (savedAssignments == null) {
			final TagAssignments newAssignments = new TagAssignments();
			newAssignments.setCoordinates(coordinatesDto);
			newAssignments.setTags(Arrays.asList(singleTagAssignment));
			tagAssignments.insertOne(newAssignments);
		} else {
			savedAssignments.getTags().removeIf(single -> single.getTag().equals(singleTagAssignment.getTag()));
			savedAssignments.getTags().add(singleTagAssignment);
			tagAssignments.replaceOne(query, savedAssignments);
		}

	}

	private MongoCollection<TagAssignments> getTagAssignmentColletions() {
		return this.mongoBddDatabase.getCollection("tagAssignment", TagAssignments.class);
	}
}
