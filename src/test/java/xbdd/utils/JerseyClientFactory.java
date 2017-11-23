/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.utils;

import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;

import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import xbdd.webapp.util.BasicDBReader;

/**
 * A factory for creating Jersey {@link Client}s to communicate with link XBDD
 */
public class JerseyClientFactory {
	private static JerseyClientFactory INSTANCE = new JerseyClientFactory();

	/**
	 * Get the factory for creating Jersey {@link Client}s from XBDD
	 *
	 * @return The factory for creating jersey clients
	 */
	public static JerseyClientFactory getInstance() {
		return INSTANCE;
	}

	/** No external constructor */
	private JerseyClientFactory() {
	}

	/**
	 * Create a {@link Client} which authenticates with Basic Authentication.
	 *
	 * @return The constructed client
	 */
	public Client createAuthenticatingClient() {
		return createClient(new JerseyClientOptions().withBasicAuthentication());
	}

	/**
	 * Create a {@link Client} which authenticates with Admin Authentication.
	 *
	 * @return The constructed client
	 */
	public Client createAdminAuthenticatingClient() {
		return createClient(new JerseyClientOptions().withAdminAuthentication());
	}

	/**
	 * Create a {@link Client} with the given options.
	 *
	 * @param options
	 *            The options to customize the construction of the client
	 * @return The constructed client
	 */
	public Client createClient(final JerseyClientOptions options) {
		// Create a trust manager that does not validate certificate chains
		final TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
			@Override
			public X509Certificate[] getAcceptedIssuers() {
				return null;
			}

			@Override
			public void checkClientTrusted(final X509Certificate[] certs, final String authType) {
			}

			@Override
			public void checkServerTrusted(final X509Certificate[] certs, final String authType) {
			}
		} };

		// Install the all-trusting trust manager
		try {
			final SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

			// Create all-trusting host name verifier
			final HostnameVerifier allHostsValid = new HostnameVerifier() {
				@Override
				public boolean verify(final String hostname, final SSLSession session) {
					return true;
				}
			};

			final Client client = ClientBuilder.newBuilder().sslContext(sc).hostnameVerifier(allHostsValid).build();
			final HttpAuthenticationFeature feature = HttpAuthenticationFeature.basicBuilder()
					.credentials(options.getUsername(), options.getPassword()).build();
			client.register(feature);
			client.register(BasicDBReader.class);
			return client;
		} catch (final Exception e) {
		}
		return null;
	}
}
