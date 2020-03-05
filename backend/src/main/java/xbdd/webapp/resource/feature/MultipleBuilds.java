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

import org.glassfish.jersey.server.mvc.Viewable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Path("/multiple-builds")
public class MultipleBuilds {

	private static final String VIEW_ID = "/multipleBuilds";

	@POST
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response getPage(@FormParam("builds") final String builds, @FormParam("version") final String version,
			@FormParam("product") final String product) {
		final Map<String, Object> map = new HashMap<String, Object>();
		map.put("builds", builds);
		map.put("version", version);
		map.put("product", product);
		return Response.ok(new Viewable(VIEW_ID, map)).build();
	}

	@GET
	public Response redirectPage(@Context final HttpServletResponse resp,
			@Context final HttpServletRequest req) throws IOException {
		resp.sendRedirect(req.getContextPath());
		return null;
	}
}
