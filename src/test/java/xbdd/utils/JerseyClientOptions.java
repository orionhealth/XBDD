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

import javax.ws.rs.client.Client;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

/**
 * Options to customize the creation of a Jersey {@link Client}'s.
 */
public class JerseyClientOptions {

	private String username;
	private String password;

	public JerseyClientOptions() {
		withBasicAuthentication();
	}

	/**
	 * Specify the Basic Authentication credentials.
	 *
	 * @param username The username to use with Basic Authentication
	 * @param password The password to use with Basic Authentication
	 * @return JerseyClientOptions - used to chain calls.
	 */
	@SuppressWarnings("hiding")
	public JerseyClientOptions withBasicAuthentication(final String username, final String password) {
		this.username = username;
		this.password = password;
		return this;
	}

	/**
	 * Specify the Basic Authentication credentials.
	 *
	 * @return JerseyClientOptions - used to chain calls.
	 */
	public JerseyClientOptions withBasicAuthentication() {
		return withBasicAuthentication("test", "password");
	}

	public JerseyClientOptions withAdminAuthentication() {
		return withBasicAuthentication("admin", "password");
	}

	public String getUsername() {
		return this.username;
	}

	public String getPassword() {
		return this.password;
	}

	@Override
	public boolean equals(final Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}

	@Override
	public int hashCode() {
		return HashCodeBuilder.reflectionHashCode(this);
	}
}