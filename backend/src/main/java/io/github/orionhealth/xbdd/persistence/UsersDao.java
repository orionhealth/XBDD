package io.github.orionhealth.xbdd.persistence;

import java.util.ArrayList;
import java.util.List;

import org.bson.conversions.Bson;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import io.github.orionhealth.xbdd.factory.MongoDBAccessor;
import io.github.orionhealth.xbdd.model.common.Users;

public class UsersDao {

	private final MongoDBAccessor mongoDBAccessor;

	public UsersDao() {
		this.mongoDBAccessor = new MongoDBAccessor();
	}

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
		final MongoDatabase bdd = this.mongoDBAccessor.getDatabase();
		return bdd.getCollection("users", Users.class);
	}
}
