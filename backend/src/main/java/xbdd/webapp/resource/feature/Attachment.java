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

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import xbdd.webapp.factory.MongoDBAccessor;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.IOException;

@Path("/attachment")
public class Attachment {

	private final MongoDBAccessor client;

	@Inject
	public Attachment(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/{id}")
	public javax.ws.rs.core.Response getAttachment(@PathParam("id") final String id) throws IOException {
		final DB db = this.client.getDB("grid");
		final GridFS gridFS = new GridFS(db);
		final GridFSDBFile file = gridFS.findOne(id);
		// log.info(file);
		if (file == null) {
			throw new WebApplicationException(404);
		}
		return Response.ok(org.apache.commons.io.IOUtils.toByteArray(file.getInputStream()), file.getContentType()).build();

	}
}
