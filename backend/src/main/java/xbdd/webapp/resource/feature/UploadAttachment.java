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
package xbdd.webapp.resource.feature;

import com.mongodb.*;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import xbdd.webapp.factory.MongoDBAccessor;

import javax.inject.Inject;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Path("/upload-attachment")
@MultipartConfig
public class UploadAttachment {

	private final MongoDBAccessor client;

	@Inject
	public UploadAttachment(final MongoDBAccessor client) {
		this.client = client;
	}

	@SuppressWarnings("unchecked")
	@POST
	@Path("/{elementId}/{report}/{version}/{build}/{id}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String setAttachment(@PathParam("report") final String report, @PathParam("version") final String version,
			@PathParam("build") final String build, @PathParam("id") final String id, @PathParam("elementId") final String elementId,
			@FormDataParam("attachmentfile") final File file, @FormDataParam("attachmentfile") final FormDataBodyPart body,
			@Context final HttpServletRequest req)
			throws IOException {
		try (final InputStream is = new FileInputStream(file.getAbsolutePath())) {
			final String elementIdMod = elementId.replace("&2F", "/");
			final DB gridDB = this.client.getDB("grid");
			final GridFS gridFS = new GridFS(gridDB);
			final GridFSInputFile gridFile = gridFS.createFile(is);
			gridFile.setFilename(body.getMediaType().toString().split("/")[0] + ".x1.mu." + UUID.randomUUID().toString());
			gridFile.setContentType(body.getMediaType().toString());
			gridFile.save();
			final DB bddDB = this.client.getDB("bdd");
			final DBCollection collection = bddDB.getCollection("features");
			// // get object
			final String featureId = report + "/" + version + "/" + build + "/" + id;
			final DBObject feature = collection.findOne(new BasicDBObject("_id", featureId));
			final BasicDBList elements = (BasicDBList) feature.get("elements");
			String scenarioName = "";
			if (elements != null) {
				for (int i = 0; i < elements.size(); i++) {
					final DBObject scenario = (DBObject) elements.get(i);
					if (scenario.get("id").equals(id + ";" + elementIdMod)) {
						scenarioName = (String) scenario.get("name");
						// get steps
						final BasicDBList steps = (BasicDBList) scenario.get("steps");
						final DBObject laststep = (DBObject) steps.get(steps.size() - 1);
						List<String> embeddings = new ArrayList<String>();
						if (laststep.containsField("embeddings")) {
							embeddings = (ArrayList<String>) laststep.get("embeddings");
						}
						embeddings.add(gridFile.getFilename()); // get existng then add to them
						laststep.put("embeddings", embeddings);
						steps.set(steps.size() - 1, laststep);
						scenario.put("steps", steps);
						elements.set(i, scenario);
					}
				}
			}
			feature.put("elements", elements);
			feature.put("statusLastEditedBy", req.getRemoteUser());
			feature.put("lastEditOn", new Date());

			// add edit update
			BasicDBList edits = (BasicDBList) feature.get("edits");
			if (edits == null) {
				edits = new BasicDBList();
			}
			final BasicDBList temp = new BasicDBList();
			temp.add(new BasicDBObject()
					.append("id", "embeddings")
					.append("added", gridFile.getFilename())
					.append("removed", null));

			final BasicDBList masks = new BasicDBList();
			masks.add(new BasicDBObject()
					.append("scenario", scenarioName)
					.append("changes", temp));

			final BasicDBObject edit = new BasicDBObject()
					.append("name", feature.get("statusLastEditedBy"))
					.append("date", feature.get("lastEditOn"))
					.append("prev", feature.get("calculatedStatus"))
					.append("curr", feature.get("calculatedStatus"))
					.append("stepChanges", masks);

			final BasicDBList newEdits = new BasicDBList();
			newEdits.add(edit);
			newEdits.addAll(edits);
			feature.put("edits", newEdits);

			collection.save(feature);
			return gridFile.getFilename();
		}
	}
}
