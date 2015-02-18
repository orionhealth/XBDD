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
package xbdd;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.events.EventFiringWebDriver;

/**
 * A WebDriver wrapper that can be injected with pico
 */
public class XbddDriver extends EventFiringWebDriver {

	private static WebDriver createDriver() throws MalformedURLException {
		final WebDriver driver;
		switch (getSeleniumProfile()) {
			case "chrome":
				driver = new ChromeDriver();
				break;
			case "phantom-js":
				driver = getPhantomJsDriver();
				break;
			case "selenium-grid":
				driver = getSeleniumGridRemoteDriver();
				break;
			default:
				driver = new FirefoxDriver();
				break;
		}

		return driver;
	}

	private static String getSeleniumProfile() {
		// if selenium.profile is not set revert to selenium.grid for backwards compatibility of CI config for old branches
		final String seleniumProfile;
		if (StringUtils.isNotEmpty(System.getProperty("selenium.profile"))) {
			seleniumProfile = System.getProperty("selenium.profile");
		} else if (StringUtils.isNotEmpty(System.getProperty("selenium.grid"))) {
			seleniumProfile = "selenium-grid";
		} else {
			seleniumProfile = "";
		}
		return seleniumProfile;
	}

	private static WebDriver getPhantomJsDriver() {
		final DesiredCapabilities caps = DesiredCapabilities.phantomjs();

		caps.setCapability(PhantomJSDriverService.PHANTOMJS_CLI_ARGS,
				new String[] { "--ignore-ssl-errors=true" });

		final PhantomJSDriver phantomJSDriver = new PhantomJSDriver(caps);
		phantomJSDriver.manage().window().setSize(new Dimension(1280, 800));
		return phantomJSDriver;
	}

	private static WebDriver getSeleniumGridRemoteDriver() throws MalformedURLException {
		final DesiredCapabilities desiredCapabilities = new DesiredCapabilities();
		desiredCapabilities.setBrowserName(System.getProperty("selenium.grid.browser", "firefox"));
		desiredCapabilities.setVersion(System.getProperty("selenium.grid.version", ""));
		desiredCapabilities.setPlatform(Platform.ANY);

		final URL url = new URL("http", System.getProperty("selenium.grid"), Integer.valueOf(System.getProperty(
				"selenium.grid.port", "4444")), "/wd/hub");

		final RemoteWebDriver remoteWebDriver = new RemoteWebDriver(url,
				desiredCapabilities);
		remoteWebDriver.setFileDetector(new LocalFileDetector());
		return new Augmenter().augment(remoteWebDriver);
	}

	/**
	 * Constructs a WebDriver to use for testing.
	 * <p>
	 * If the system variable selenium.grid is set, a remote web driver will be constructed; otherwise firefox.
	 * 
	 * @throws MalformedURLException if selenium.grid is an invalid hostname or selenium.grid.port is an invalid port number.
	 */
	public XbddDriver() throws MalformedURLException {
		super(createDriver());
	}

}
