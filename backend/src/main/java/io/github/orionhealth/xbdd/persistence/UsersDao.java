package io.github.orionhealth.xbdd.persistence;

import java.util.ArrayList;
import java.util.List;

import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.model.common.Users;

@Repository
public class UsersDao {

	@Autowired
	private MongoDatabase mongoBddDatabase;

	public List<String> getUserFavourites(final String userId) {
		final MongoCollection<Users> users = getUsersColletions();
		final ArrayList<String> favourites = new ArrayList<>();

		final Bson query = Filters.eq("user_id", userId);
		final Users user = users.find(query).first();

		if (user != null && user.getFavourites() != null) {
			for (final String product : user.getFavourites().keySet()) {
				if (user.getFavourites().get(product)) {
					favourites.add(product);
				}
			}
		}

		return favourites;
	}

	private MongoCollection<Users> getUsersColletions() {
		return this.mongoBddDatabase.getCollection("users", Users.class);
	}
}
