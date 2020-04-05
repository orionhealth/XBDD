package io.github.orionhealth.xbdd.persistence;

import java.util.UUID;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

import io.github.orionhealth.xbdd.model.junit.JUnitEmbedding;
import io.github.orionhealth.xbdd.util.Coordinates;

@Repository
public class ImageDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(ImageDao.class);

	@Autowired
	private DB mongoLegacyGrid;

	public String saveImageAndReturnFilename(final JUnitEmbedding embedding, final Coordinates coordinates, final String featureId,
			final String scenarioId) {
		final GridFS gridFS = getGridFS();

		try {
			final GridFSInputFile image = gridFS
					.createFile(Base64.decodeBase64((embedding.getData()).getBytes()));

			image.setFilename(UUID.randomUUID().toString());

			final BasicDBObject metadata = new BasicDBObject().append("product", coordinates.getProduct())
					.append("major", coordinates.getMajor()).append("minor", coordinates.getMinor())
					.append("servicePack", coordinates.getServicePack()).append("build", coordinates.getBuild())
					.append("feature", featureId)
					.append("scenario", scenarioId);
			image.setMetaData(metadata);
			image.setContentType(embedding.getMime_type());
			image.save();

			return image.getFilename();

		} catch (final ClassCastException e) {
			LOGGER.warn("Embedding was malformed and will be skipped");
			return null;
		}
	}

	private GridFS getGridFS() {
		return new GridFS(this.mongoLegacyGrid);
	}
}
