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
package xbdd.hook;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriverException;

import xbdd.XbddDriver;
import cucumber.api.Scenario;
import cucumber.api.java.After;

public class WebDriverHook {
	private final XbddDriver driver;

	public WebDriverHook(final XbddDriver driver) {
		this.driver = driver;
	}

	@After("@browser")
	public void after(final Scenario result) {
		embedScreenshot(result);
		this.driver.quit();
	}

	private void embedScreenshot(final Scenario result) {
		try {
			final byte[] screenshot = this.driver.getScreenshotAs(OutputType.BYTES);
			result.embed(screenshot, "image/png");
		} catch (final UnsupportedOperationException somePlatformsDontSupportScreenshots) {
			System.err.println(somePlatformsDontSupportScreenshots.getMessage());
		} catch (final WebDriverException e) {
			result.write("WARNING. Failed take screenshots with exception:" + e.getMessage());
		}
	}
}
