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
package xbdd.report;

import java.util.UUID;

public class ReportContext {

	private final static int DEFUALT_MAJOR_VERSION = 1;
	private final static int DEFUALT_MINOR_VERSION = 0;
	private final static int DEFUALT_SERVICEPACK_VERSION = 0;
	private final static String DEFUALT_BUILD_VERSION = "1";

	private String product = "test-" + UUID.randomUUID().toString().substring(0, 30);
	private int majorVersion = DEFUALT_MAJOR_VERSION;
	private int minorVersion = DEFUALT_MINOR_VERSION;
	private int servicePackVersion = DEFUALT_SERVICEPACK_VERSION;
	private String build = DEFUALT_BUILD_VERSION;

	public String getProduct() {
		return this.product;
	}

	public void setProduct(final String product) {
		this.product = product;
	}

	public int getMajorVersion() {
		return this.majorVersion;
	}

	public void setMajorVersion(final int majorVersion) {
		this.majorVersion = majorVersion;
	}

	public int getMinorVersion() {
		return this.minorVersion;
	}

	public void setMinorVersion(final int minorVersion) {
		this.minorVersion = minorVersion;
	}

	public int getServicePackVersion() {
		return this.servicePackVersion;
	}

	public void setServicePackVersion(final int servicePackVersion) {
		this.servicePackVersion = servicePackVersion;
	}

	public String getBuild() {
		return this.build;
	}

	public void setBuild(final String build) {
		this.build = build;
	}

	@Override
	public String toString() {
		return "ReportContext [product=" + this.product + ", majorVersion=" + this.majorVersion + ", minorVersion=" + this.minorVersion
				+ ", servicePackVersion=" + this.servicePackVersion + ", build=" + this.build + "]";
	}

}
