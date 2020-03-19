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

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;

@RunWith(MockitoJUnitRunner.class)
public class BasicAuthFilterTest {

	private BasicAuthFilter filter;

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private FilterChain filterChain;

	@Before
	public void setup() {
		this.filter = new BasicAuthFilter();
	}

	@Test
	public void testDoFilter_authenticated() throws Exception {
		Mockito.when(this.request.getUserPrincipal()).thenReturn(Mockito.mock(Principal.class));

		this.filter.doFilter(this.request, this.response, this.filterChain);

		Mockito.verify(this.filterChain).doFilter(this.request, this.response);
	}

	@Test
	public void testDoFilter_withBasic() throws Exception {
		Mockito.when(this.request.getUserPrincipal()).thenReturn(null).thenReturn(Mockito.mock(Principal.class));
		Mockito.when(this.request.getHeader("Authorization")).thenReturn("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");

		this.filter.doFilter(this.request, this.response, this.filterChain);

		Mockito.verify(this.request).login("Aladdin", "open sesame");
		Mockito.verify(this.filterChain).doFilter(this.request, this.response);
	}

	@Test
	public void testDoFilter_withColon() throws Exception {
		Mockito.when(this.request.getUserPrincipal()).thenReturn(null).thenReturn(Mockito.mock(Principal.class));
		Mockito.when(this.request.getHeader("Authorization")).thenReturn("Basic QWxhZGRpbjpvcGVuOnNlc2FtZQ==");

		this.filter.doFilter(this.request, this.response, this.filterChain);

		Mockito.verify(this.request).login("Aladdin", "open:sesame");
		Mockito.verify(this.filterChain).doFilter(this.request, this.response);
	}

	@Test
	public void testDoFilter_fallback() throws Exception {
		Mockito.when(this.request.getUserPrincipal()).thenReturn(null);
		Mockito.when(this.request.getHeader("Authorization")).thenReturn(null);

		this.filter.doFilter(this.request, this.response, this.filterChain);

		Mockito.verify(this.request).authenticate(this.response);
	}

	@Test
	public void testDoFilter_fallbackDigest() throws Exception {
		Mockito.when(this.request.getUserPrincipal()).thenReturn(null);
		Mockito.when(this.request.getHeader("Authorization")).thenReturn("NotBasic");

		this.filter.doFilter(this.request, this.response, this.filterChain);

		Mockito.verify(this.request).authenticate(this.response);
	}

}
