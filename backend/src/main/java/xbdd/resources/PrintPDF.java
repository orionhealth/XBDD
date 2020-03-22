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
package xbdd.resources;

import org.apache.commons.io.IOUtils;
import xbdd.util.Coordinates;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Path("/print-pdf")
public class PrintPDF {

	private static final String XBDD_PHANTOMJS_HOME_INIT_PARAMETER = "sample_reports.phantomjs.home";
	private static final String XBDD_PHANTOMJS_USERNAME_INIT_PARAMETER = "sample_reports.phantomjs.username";
	private static final String XBDD_PHANTOMJS_PASSWORD_INIT_PARAMETER = "sample_reports.phantomjs.password";

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/")
	public Response viewPDF(@BeanParam final Coordinates coord, @Context final HttpServletRequest request,
			@Context final ServletContext context, @QueryParam("view") final String view) throws URISyntaxException {

		final String urlcontext = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
				+ request.getContextPath();
		final String previousPage = request.getHeader("Referer");

		final String productString = "/" + coord.getProduct() + "/" + coord.getVersionString() + "/" + coord.getBuild();
		final String urlstring = urlcontext + "/print/" + productString;

		// Getting the location of PHANTOMJS_HOME environment variable
		final String phantomjsloc = Objects.toString(context.getInitParameter(XBDD_PHANTOMJS_HOME_INIT_PARAMETER),
				System.getProperty("PHANTOMJS_HOME"));
		if (phantomjsloc == null) {
			final URI location = new URI(previousPage + "&phantom=no");
			return Response.temporaryRedirect(location).build();
		} else {
			final String username = Objects.toString(context.getInitParameter(XBDD_PHANTOMJS_USERNAME_INIT_PARAMETER),
					System.getProperty("PHANTOMJS_USER"));
			final String password = Objects.toString(context.getInitParameter(XBDD_PHANTOMJS_PASSWORD_INIT_PARAMETER),
					System.getProperty("PHANTOMJS_PASSWORD"));
			final StreamingOutput stream = createPDFStream(urlstring, phantomjsloc, context.getRealPath("/WEB-INF/rasterize.js"), username,
					password);

			String viewType = "inline";
			// View in browser or download as attachment
			if (view != null) {
				viewType = view;
			}

			final ResponseBuilder response = Response.ok(stream);
			response.type("application/pdf");
			response.status(200);
			response.header("Content-Disposition", viewType + "; filename=\"" + coord.getProduct() + " Version=" +
					coord.getVersionString() + ", Build=" + coord.getBuild() + ".pdf\"");
			return response.build();
		}
	}

	public StreamingOutput createPDFStream(final String urlstring, final String phantomjsloc, final String rasterJsPath,
			final String username, final String password) {
		final StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(final OutputStream os) throws IOException, WebApplicationException {

				final File tmpFile = File.createTempFile("report", ".pdf");
				final List<String> commands = new ArrayList<>();
				final String osName = System.getProperty("os.name").toLowerCase();
				if (osName.contains("win")) {// It's windows
					commands.add("CMD");
					commands.add("/c");
					commands.add(phantomjsloc + "\\phantomjs");
					commands.add("--ignore-ssl-errors=yes");
					commands.add(rasterJsPath);
					commands.add("\"" + urlstring + "\"");
				} else {// Assume it's linux
					commands.add(phantomjsloc + "/phantomjs");
					commands.add("--ignore-ssl-errors=yes");
					commands.add(rasterJsPath);
					commands.add(urlstring);
				}
				commands.add(tmpFile.getAbsolutePath());
				commands.add(username);
				commands.add(password);

				generatePDF(commands);
				makeStream(tmpFile, os);
				tmpFile.delete();
			}
		};

		return stream;
	}

	public void generatePDF(final List<String> commands) throws IOException {
		final ProcessBuilder probuilder = new ProcessBuilder(commands);
		probuilder.redirectError();
		probuilder.redirectOutput();
		probuilder.redirectInput();
		final Process process = probuilder.start();
		try {
			process.waitFor();
		} catch (final InterruptedException e) {
			e.printStackTrace();
		}
		process.destroy();
	}

	public void makeStream(final File tmpFile, final OutputStream os) throws IOException {
		try (InputStream inputStream = new FileInputStream(tmpFile);
				BufferedOutputStream fos1 = new BufferedOutputStream(os)) {
			final byte[] bytes = IOUtils.toByteArray(inputStream);
			fos1.write(bytes);
			fos1.flush();
		}
	}
}
