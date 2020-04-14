package io.github.orionhealth.xbdd.persistence;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.model.common.User;

@Repository
public class UsersDao {

	@Autowired
	private MongoDatabase mongoBddDatabase;

	public User getUser(final String userId) {
		final MongoCollection<User> users = getUsersColletions();
		final Bson query = Filters.eq("user_id", userId);

		return users.find(query).first();
	}

	public User saveUser(final User user) {
		final MongoCollection<User> users = getUsersColletions();
		final Bson query = Filters.eq("user_id", user.getUserId());

		final User savedUser = users.find(query).first();

		if (savedUser == null) {
			users.insertOne(user);

			return user;
		}

		if (!StringUtils.equals(savedUser.getDisplay(), user.getDisplay())) {
			savedUser.setDisplay(user.getDisplay());
			users.replaceOne(query, savedUser);
		}

		return savedUser;

	}

	public List<String> getUserFavourites(final String userId) {
		final MongoCollection<User> users = getUsersColletions();
		final ArrayList<String> favourites = new ArrayList<>();

		final Bson query = Filters.or(Filters.eq("user_id", userId));
		final User user = users.find(query).first();

		if (user != null && user.getFavourites() != null) {
			for (final String product : user.getFavourites().keySet()) {
				if (user.getFavourites().get(product)) {
					favourites.add(product);
				}
			}
		}

		return favourites;
	}

	private MongoCollection<User> getUsersColletions() {
		return this.mongoBddDatabase.getCollection("users", User.class);
	}
}
