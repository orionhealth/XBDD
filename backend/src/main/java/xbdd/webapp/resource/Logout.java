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
package xbdd.webapp.resource;

import org.apache.log4j.Logger;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;

@Path("logout")
public class Logout {

	private static final Logger LOGGER = Logger.getLogger(Logout.class);

	@GET
	public Response logout(@Context final HttpServletRequest request, @Context final ServletContext context) throws URISyntaxException {
		try {
			request.logout();
		} catch (final ServletException e) {
			LOGGER.error("Failed to logout", e);
		}
		return Response.temporaryRedirect(new URI(context.getContextPath())).build();
	}
}
