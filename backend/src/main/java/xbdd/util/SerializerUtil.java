package xbdd.util;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import java.lang.reflect.Type;
import java.util.List;

public class SerializerUtil {
	private static final Gson gson = new Gson();

	private SerializerUtil() {
	}

	public static String serialise(final DBObject toSerialise) {
		return gson.toJson(toSerialise);
	}

	public static String serialise(final BasicDBObject toSerialise) {
		return gson.toJson(toSerialise);
	}

	public static String serialise(final BasicDBList toSerialise) {
		return gson.toJson(toSerialise);
	}

	public static String serialise(final List<?> toSerialise) {
		return gson.toJson(toSerialise);
	}

	public static <T> List<T> deserialiseListOf(final String toDeserialise, final Class<T> unused) {
		final Type listType = new TypeToken<List<T>>() {
		}.getType();
		return gson.fromJson(toDeserialise, listType);
	}

}
