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
package xbdd.webapp.rest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Simple authentication filter that checks for basic authentication headers and otherwise defers to the realm's authentication mechanism.
 */
public class BasicAuthFilter implements Filter {

	private static final String AUTHORIZATION_HEADER = "Authorization";
	private static final String BASIC_PREFIX = "Basic ";
	private static final String BASIC_AUTH_SEPARATOR = ":";

	@Override
	public void destroy() {

	}

	@Override
	public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain filterChain) throws IOException,
			ServletException {
		final HttpServletRequest httpRequest = (HttpServletRequest) request;
		final HttpServletResponse httpResponse = (HttpServletResponse) response;

		if (httpRequest.getUserPrincipal() == null) {
			final String basicAuth = httpRequest.getHeader(AUTHORIZATION_HEADER);

			if (basicAuth != null && StringUtils.startsWithIgnoreCase(basicAuth, BASIC_PREFIX)) {
				final String usernamePassword = new String(Base64.decodeBase64(basicAuth.substring(BASIC_PREFIX.length()).trim()), "UTF-8");
				final String[] args = usernamePassword.split(BASIC_AUTH_SEPARATOR, 2);
				httpRequest.login(args[0], args[1]);
			} else {
				httpRequest.authenticate(httpResponse);
				return;
			}
		}

		filterChain.doFilter(request, response);
	}

	@Override
	public void init(final FilterConfig arg0) throws ServletException {

	}

}
