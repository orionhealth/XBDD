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

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.mongodb.DBObject;

import xbdd.XbddDriver;
import xbdd.utils.JerseyClientFactory;
import xbdd.utils.XBDDInstance;

public class ReportManager {

	public static String FEATURE_LIST_ID = "featureIndex";

	public static final Function<WebElement, FeatureSummary> WEB_ELEMENT_TO_FEATURE_SUMMARY = new Function<WebElement, FeatureSummary>() {
		@Override
		public FeatureSummary apply(final WebElement featureElement) {
			final FeatureSummary summary = new FeatureSummary();
			summary.setTitle(featureElement.findElement(By.cssSelector(".feature-name")).getText());
			final String result = featureElement.getAttribute("data-status");
			summary.setResult((result) != null ? result : "undefined");
			final List<WebElement> tagElements = featureElement.findElements(By.cssSelector(".feature-tag"));
			summary.setTags(Lists.transform(tagElements,
					new Function<WebElement, String>() {
						@Override
						public String apply(final WebElement tagElement) {
							return tagElement.getText();
						}
					}));

			if (!featureElement.findElements(By.cssSelector(".feature-description")).isEmpty()) {
				summary.setDescription(featureElement.findElement(By.cssSelector(".feature-description")).getText());
			}
			summary.setScenarios(Lists.transform(featureElement.findElements(By.cssSelector(".scenario")),
					WEB_ELEMENT_SCENARIO_SUMMARY));
			return summary;
		}
	};

	public static final Function<WebElement, ScenarioSummary> WEB_ELEMENT_SCENARIO_SUMMARY = new Function<WebElement, ScenarioSummary>() {
		@Override
		public ScenarioSummary apply(final WebElement element) {
			final ScenarioSummary scenarioSummary = new ScenarioSummary();
			scenarioSummary.setName(element.findElement(By.cssSelector(".scenario-name")).getText());
			scenarioSummary.setDescription(element.findElement(By.cssSelector(".scenario-description")).getText());
			scenarioSummary.setResult(element.getAttribute("data-status"));
			final List<WebElement> tagElements = element.findElements(By.cssSelector(".scenario-tag"));
			scenarioSummary.setTags(Lists.transform(tagElements,
					new Function<WebElement, String>() {
						@Override
						public String apply(final WebElement tagElement) {
							return tagElement.getText();
						}
					}));
			final List<WebElement> stepElements = element.findElements(By.cssSelector(".step"));
			scenarioSummary.setSteps(Lists.transform(stepElements,
					new Function<WebElement, StepSummary>() {
						@Override
						public StepSummary apply(final WebElement stepElement) {
							return new StepSummary(stepElement.getText(), stepElement.getAttribute("data-status"));
						}
					}));
			scenarioSummary.setTestingTips(element.findElement(By.cssSelector(".testing-tips")).getAttribute("value"));
			scenarioSummary.setEnvironment(element.findElement(By.cssSelector(".environment-notes")).getAttribute("value"));
			scenarioSummary.setExecutionNotes(element.findElement(By.cssSelector(".execution-notes")).getAttribute("value"));
			return scenarioSummary;
		}
	};

	public static final Function<WebElement, StepSummary> WEB_ELEMENT_TO_STEP_SUMMARY = new Function<WebElement, StepSummary>() {

		@Override
		public StepSummary apply(final WebElement element) {
			final StepSummary step = new StepSummary();
			step.setStep(element.getText());
			step.setStatus(element.getAttribute("data-status"));
			return step;
		}
	};

	private final Client client;
	private final WebDriver webDriver;
	private final XBDDInstance xbddInstance;

	/**
	 * Create a new XBDDFileHelper REST service helper which provides methods for managing report
	 */
	public ReportManager(final XbddDriver webDriver, final XBDDInstance xbddInstance) {
		this.xbddInstance = xbddInstance;
		this.client = JerseyClientFactory.getInstance().createAuthenticatingClient();
		this.webDriver = webDriver;
	}

	/**
	 * Load a test results JSON file to xbdd and check that the response was ok
	 * 
	 * @param resource The path to the resource file relative to this class' classloader
	 * @param rootURL The root url for the restful service call
	 * @param reportContext The context of the report
	 * @throws IllegalArgumentException IOException
	 */
	public void loadReport(final String resource, final String rootURL, final ReportContext reportContext) throws IllegalArgumentException,
			IOException {
		try (final InputStream is = this.getClass().getClassLoader().getResourceAsStream(resource)) {
			final Response response = this.client
					.target(rootURL + "/rest/reports/" + reportContext.getProduct() + "/" + reportContext.getMajorVersion() + "."
							+ reportContext.getMinorVersion() + "." + reportContext.getServicePackVersion() + "/"
							+ reportContext.getBuild())
					.request()
					.put(Entity.entity(is, MediaType.APPLICATION_JSON));

			if (response.getStatus() != 200) {
				throw new IllegalStateException("Unexpected response code loading test result file: " + response);
			}
		}
	}

	/**
	 * Retrieve a feature DBObject file to xbdd
	 * 
	 * @param rootURL The root url for the restful service call
	 * @param reportContext The context of the report
	 * @param featureId The id of the feature
	 * 
	 * @return the feature information
	 */
	public DBObject getFeature(final String rootURL, final ReportContext reportContext, final String featureId) {
		final DBObject feature = this.client
				.target(rootURL + "/rest/feature/" + reportContext.getProduct() + "/" + reportContext.getMajorVersion() + "."
						+ reportContext.getMinorVersion() + "." + reportContext.getServicePackVersion() + "/"
						+ reportContext.getBuild() + "/" + featureId)
				.request()
				.get(DBObject.class);
		return feature;
	}

	/**
	 * Update the old feature results with the new feature results, and check that the response was ok
	 * 
	 * @param feature The feature
	 * @param rootURL The root url for the restful service call
	 * @param reportContext The context of the report
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws IllegalArgumentException IOException
	 */
	public void updateFeature(final DBObject feature, final String rootURL, final ReportContext reportContext, final String featureId) {
		final Response response = this.client
				.target(rootURL + "/rest/feature/" + reportContext.getProduct() + "/" + reportContext.getMajorVersion() + "."
						+ reportContext.getMinorVersion() + "." + reportContext.getServicePackVersion() + "/"
						+ reportContext.getBuild() + "/" + featureId)
				.request()
				.put(Entity.entity(feature, MediaType.APPLICATION_JSON));

		if (response.getStatus() != 200) {
			throw new IllegalStateException("Unexpected response code loading test result file: " + response);
		}
	}

	/**
	 * Open a report by navigating to its page
	 * 
	 * @param reportContext The context of the report
	 */
	public void openReport(final ReportContext reportContext) {
		this.webDriver.navigate().to(
				this.xbddInstance.getBaseURL() + "/reports/" + reportContext.getProduct() + "/"
						+ reportContext.getMajorVersion() + "."
						+ reportContext.getMinorVersion() + "." + reportContext.getServicePackVersion() + "/"
						+ reportContext.getBuild());
	}

	/**
	 * Open a report by navigating to its page and put the feature in context
	 * 
	 * @param reportContext The context of the report
	 * @param feature the name of the feature
	 */
	public void openFeature(final ReportContext reportContext, final String feature) {
		this.webDriver.navigate().to(
				this.xbddInstance.getBaseURL() + "/reports/" + reportContext.getProduct() + "/"
						+ reportContext.getMajorVersion() + "."
						+ reportContext.getMinorVersion() + "." + reportContext.getServicePackVersion() + "/"
						+ reportContext.getBuild() + "/" + feature);
	}

	/**
	 * Open a openScenario from a report
	 * 
	 * @param reportContext The context of the report
	 * @param feature The name of the feature
	 * @param scenarioPathParam The part of scenario id
	 * @param scenarioName The name of the scenario
	 * 
	 * @return the summary of the scenario
	 */
	public ScenarioSummary openScenario(final ReportContext reportContext, final String feature, final String scenarioPathParam) {
		openFeature(reportContext, feature);
		final String id = feature + "\\;" + scenarioPathParam;
		new WebDriverWait(this.webDriver, 20).until(ExpectedConditions.elementToBeClickable(By.cssSelector("#" + id + " .scenario-name")))
				.click();

		return new WebDriverWait(this.webDriver, 20).until(new Function<WebDriver, ScenarioSummary>() {
			@Override
			public ScenarioSummary apply(final WebDriver driver) {
				return WEB_ELEMENT_SCENARIO_SUMMARY.apply(driver.findElement(By.cssSelector("#" + id)));
			}
		});
	}

	/**
	 * Return the list of features from a report.
	 * 
	 * @return a list of {@link FeatureSummary}s. Will not be empty.
	 * @throws {@link TimeoutException} if no features are found within 20 seconds.
	 * */
	public List<FeatureSummary> getFeatures() {
		return new WebDriverWait(this.webDriver, 20)
				.until(new Function<WebDriver, List<FeatureSummary>>() {
					@Override
					public List<FeatureSummary> apply(final WebDriver driver) {
						final List<WebElement> featureElements = driver.findElement(By.id(FEATURE_LIST_ID)).findElements(
								By.cssSelector(".feature-index-entry"));
						// when the test runs really fast, it sometimes gets the element but returns an empty array
						if (featureElements.isEmpty()) {
							return null;
						}

						return Lists.transform(featureElements, WEB_ELEMENT_TO_FEATURE_SUMMARY);
					}
				});
	}

	public FeatureSummary getFeature() {
		return new WebDriverWait(this.webDriver, 20)
				.until(new Function<WebDriver, FeatureSummary>() {
					@Override
					public FeatureSummary apply(final WebDriver driver) {
						return WEB_ELEMENT_TO_FEATURE_SUMMARY.apply(driver.findElement(By.cssSelector(".feature")));
					}
				});
	}

	public FeatureSummary getFeatureSummary(final String summaryId) {
		return new WebDriverWait(this.webDriver, 20).until(new Function<WebDriver, FeatureSummary>() {
			@Override
			public FeatureSummary apply(final WebDriver driver) {
				return WEB_ELEMENT_TO_FEATURE_SUMMARY.apply(driver.findElement(By.id(summaryId)));
			}
		});
	}

	/**
	 * update a feature DBObject
	 * 
	 * @param feature The jaon object form of the feature
	 * @param updateMap The map includes the fields needed to be updated with the new values for the feature json object
	 * 
	 * @return The feature DBObject
	 */
	@SuppressWarnings("unchecked")
	public DBObject updateFeatureJSONObject(final DBObject feature, final Map<String, String> updateMap) {
		final String[] namesInElements = { "testing-tips", "environment-notes", "execution-notes" };
		for (final String key : updateMap.keySet()) {
			if (Arrays.asList(namesInElements).contains(key)) {
				final List<DBObject> elements = (List<DBObject>) feature.get("elements");
				for (final DBObject scenario : elements) {
					scenario.put(key, updateMap.get(key));
				}
			}
		}
		return feature;
	}
}
