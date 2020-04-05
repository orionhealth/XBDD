package io.github.orionhealth.xbdd.util;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class SerializerUtil {
	private static final Gson gson = new Gson();

	private SerializerUtil() {
	}

	public static <T> String serialise(final T toSerialise) {
		return gson.toJson(toSerialise);
	}

	public static <T> T deserialise(final String toDeserialise, final Class<T> clazz) {
		return gson.fromJson(toDeserialise, clazz);
	}

	public static <T> List<T> deserialiseListOf(final String toDeserialise, final Class<T> unused) {
		final Type listType = new TypeToken<List<T>>() {
		}.getType();
		return gson.fromJson(toDeserialise, listType);
	}
}
