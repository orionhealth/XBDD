package io.github.orionhealth.xbdd.resources;

import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;

@Path("/attachment")
public class Attachment {

	@Autowired
	private DB mongoLegacyGrid;

	@GET
	@Path("/{id}")
	public Response getAttachment(@PathParam("id") final String id) throws IOException {
		final GridFS gridFS = new GridFS(this.mongoLegacyGrid);
		final GridFSDBFile file = gridFS.findOne(id);
		// log.info(file);
		if (file == null) {
			throw new WebApplicationException(404);
		}
		return Response.ok(org.apache.commons.io.IOUtils.toByteArray(file.getInputStream()), file.getContentType()).build();

	}
}
