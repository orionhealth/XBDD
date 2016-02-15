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
package xbdd.stepdefs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringWhiteSpace;
import static org.junit.Assert.assertThat;
import static xbdd.report.assertions.Assertions.assertThat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;

import xbdd.report.FeatureSummary;
import xbdd.report.ReportContext;
import xbdd.report.ReportManager;
import xbdd.report.ScenarioSummary;
import xbdd.report.StepSummary;
import xbdd.utils.JerseyClientFactory;
import xbdd.utils.XBDDInstance;

import com.mongodb.DBObject;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class ReportStepdefs {
	private final ReportManager reportManager;

	private final static String BASIC_REPORT_JSON_FILE = "xbdd/basic-report.json";
	private final static String BASIC_CUCUMBER_SUMMARY_ID = "feature-Abasiccucumberexample";
	private final static String BASIC_CUCUMBER_EXAMPLE_FEATURE_PATHPARAM = "a-basic-cucumber-example";
	private final static String BASIC_CUCUMBER_EXAMPLE_DESCRIPTION = "Example from https://github.com/cucumber/cucumber/blob/master/features/docs/gherkin";
	private final static String FEATURE_WITH_TAGS_PATHPARAM = "feature-with-tags";
	private final static String FEATURE_WITH_ATTACHMENT_SCENARIO_PATHPARAM = "scenarios-can-have-attachments";
	private final static String WITH_TAG_SCENARIO_NAME = "This scenario has a tag";
	private final static String FAILED_SCENARIO_NAME = "This feature fails";
	private final static String SCENARIO_WITH_ATTACHMENT_SCENARIO_NAME = "A scenario with an attachment";
	private final static String FAILED_FEATURE_PATHPARAM = "failing-feature";
	private final static ScenarioSummary[] BASIC_CUCUMBER_SCENARIOS = {
			new ScenarioSummary("I have no steps", "", "unknown status? - expected passed,failed or undefined",
					Collections.<String> emptyList(), Collections.<StepSummary> emptyList()),
			new ScenarioSummary("Test state", "", "undefined", Collections.<String> emptyList(), Arrays.asList(new StepSummary("",
					"undefined"), new StepSummary("", "undefined"))),
			new ScenarioSummary("Test state", "", "undefined", Collections.<String> emptyList(), Arrays.asList(new StepSummary("",
					"undefined"), new StepSummary("", "undefined"))),
			new ScenarioSummary("Test state", "", "undefined", Collections.<String> emptyList(), Arrays.asList(new StepSummary("",
					"undefined"), new StepSummary("", "undefined"))),
			new ScenarioSummary("Test state", "", "undefined", Collections.<String> emptyList(), Arrays.asList(new StepSummary("",
					"undefined"), new StepSummary("", "undefined"))) };

	private final static FeatureSummary[] BASIC_REPORT_FEATURES = {
			new FeatureSummary("Passing feature", "passed", Collections.<String> emptyList()),
			new FeatureSummary("Failing feature", "failed", Collections.<String> emptyList()),
			new FeatureSummary("Feature with tags", "passed", Arrays.asList("@such-test", "@wow")),
			new FeatureSummary("Descriptions everywhere", "passed", Collections.<String> emptyList()),
			new FeatureSummary("Star-notation feature", "undefined", Collections.<String> emptyList()),
			new FeatureSummary("Passing background sample", "undefined", Collections.<String> emptyList()),
			new FeatureSummary("Scenarios can have attachments", "undefined", Collections
					.<String> emptyList()),
			new FeatureSummary("A basic cucumber example", "undefined", Collections.<String> emptyList())
	};

	private final static ScenarioSummary FEATURE_WITH_TAGS_SCENARIO = new ScenarioSummary(WITH_TAG_SCENARIO_NAME, "", "passed",
			Arrays.asList("@much-automation"));
	private final static ScenarioSummary FAILED_SCENARIO = new ScenarioSummary(FAILED_SCENARIO_NAME, "", "failed",
			Collections.<String> emptyList(), Arrays.asList(new StepSummary("Given this step fails", "failed")));
	private final static ScenarioSummary WITH_AN_ATTACHEMENT_SCENARIO = new ScenarioSummary(SCENARIO_WITH_ATTACHMENT_SCENARIO_NAME, "",
			"undefined",
			Collections.<String> emptyList(), Arrays.asList(new StepSummary("Given a scenario", "undefined"), new StepSummary(
					"And it includes an attachment", "undefined")));
	private final static String EXAMPLE_SCENARIO_PATHPARAM = "this-scenario-has-a-tag";
	private final static String FAILED_SCENARIO_PATHPARAM = "this-feature-fails";
	private final static String WITH_AN_ATTACHMENT_SCENARIO_PATHPARAM = "a-scenario-with-an-attachment";

	private final static Map<String, String> FEATURE_UPDATES = new HashMap<String, String>();
	static {
		FEATURE_UPDATES.put("testing-tips", "testing tips input");
		FEATURE_UPDATES.put("environment-notes", "environment input");
		FEATURE_UPDATES.put("execution-notes", "execution notes input");
	}

	private final List<String> reports;
	private FeatureSummary featureSummary;
	private ScenarioSummary scenarioSummary, expectedScenarioSummary;

	private final XBDDInstance xbddInstance;

	private final ReportContext reportContext;

	public ReportStepdefs(final ReportManager reportManager, final XBDDInstance xbddInstance, final ReportContext reportContext) {
		this.reportManager = reportManager;
		this.xbddInstance = xbddInstance;
		this.reportContext = reportContext;
		this.reports = new ArrayList<>();
	}

	/*
	 * GIVEN
	 */
	@Given("^a test result has been uploaded$")
	public void a_test_result_has_been_uploaded() throws IOException {
		a_cucumber_json_test_report();
		the_report_is_uploaded_via_REST();
	}

	@Given("^a cucumber json test report$")
	public void a_cucumber_json_test_report() {
		this.reports.add(BASIC_REPORT_JSON_FILE);
	}

	@Given("^a cucumber feature$")
	public void a_cucumber_feature() {

	}

	@Given("^a cucumber json test report for the feature containing scenarios:$")
	public void a_cucumber_json_test_report_for_the_feature_containing_scenarios(final List<String> scenarios) {
		final String report = "xbdd/mixed-" + StringUtils.join(scenarios.toArray(), "-") + "-report.json";
		this.reports.add(report);
	}

	@Given("^a scenario with undefined status$")
	public void a_scenario_with_undefined_status() {
		this.reports.add("xbdd/mixed-scenario1-scenario3-report.json");
	}

	@Given("^a cucumber json test report for the scenario with status passed$")
	public void a_cucumber_json_test_report_for_the_scenario_with_status_passed() {
		this.reports.add("xbdd/mixed-scenario1-scenario2-report.json");
	}

	/*
	 * WHEN
	 */
	@When("^the report(?:s)? (?:is|are) uploaded via REST$")
	public void the_report_is_uploaded_via_REST() throws IOException {
		for (final String report : this.reports) {
			this.reportManager.loadReport(report, this.xbddInstance.getBaseURL(), this.reportContext);
		}
	}

	@When("^the user views the test report$")
	public void the_user_views_the_test_report() {
		this.reportManager.openReport(this.reportContext);
	}

	@When("^the user views the test report for a feature$")
	public void the_user_views_the_test_report_for_a_feature() {
		this.reportManager.openFeature(this.reportContext, BASIC_CUCUMBER_EXAMPLE_FEATURE_PATHPARAM);
	}

	@When("^the user views the test report for a scenario$")
	public void the_user_views_the_test_report_for_a_scenario() {
		final DBObject originalFeature = this.reportManager.getFeature(this.xbddInstance.getBaseURL(), this.reportContext,
				FEATURE_WITH_TAGS_PATHPARAM);
		final DBObject newFeature = this.reportManager.updateFeatureJSONObject(originalFeature, FEATURE_UPDATES);
		this.reportManager.updateFeature(newFeature, this.xbddInstance.getBaseURL(), this.reportContext, "feature-with-tags");
		this.expectedScenarioSummary = FEATURE_WITH_TAGS_SCENARIO;
		this.expectedScenarioSummary.setSteps(Arrays.asList(new StepSummary("Given this step passes", "passed")));
		this.expectedScenarioSummary.setTestingTips("testing tips input");
		this.expectedScenarioSummary.setEnvironment("environment input");
		this.expectedScenarioSummary.setExecutionNotes("execution notes input");
		this.scenarioSummary = this.reportManager.openScenario(this.reportContext, FEATURE_WITH_TAGS_PATHPARAM, EXAMPLE_SCENARIO_PATHPARAM);
	}

	@When("^the user views the test report for a scenario with a failed step$")
	public void the_user_views_the_test_report_for_a_scenario_with_a_failed_step() {
		this.scenarioSummary = this.reportManager.openScenario(this.reportContext, FAILED_FEATURE_PATHPARAM, FAILED_SCENARIO_PATHPARAM);
	}

	@When("^the user views the test report for a manual scenario$")
	public void the_user_views_the_test_report_for_a_manual_scenario() {
		this.scenarioSummary = this.reportManager.openScenario(this.reportContext, FEATURE_WITH_ATTACHMENT_SCENARIO_PATHPARAM,
				WITH_AN_ATTACHMENT_SCENARIO_PATHPARAM);
	}

	/*
	 * THEN
	 */
	@Then("^the report can be viewed$")
	public void the_report_can_be_viewed() {
		this.reportManager.openReport(this.reportContext);
		final List<FeatureSummary> features = this.reportManager.getFeatures();
		assertThat(features).isNotEmpty();
	}

	@Then("^the product's features are displayed with test status$")
	public void the_product_s_features_are_displayed_with_test_status() {
		final List<FeatureSummary> features = this.reportManager.getFeatures();
		assertThat(features).contains(BASIC_REPORT_FEATURES);
	}

	@Then("^the feature's description is displayed$")
	public void the_feature_s_description_is_displayed() {
		this.featureSummary = this.reportManager.getFeatureSummary(BASIC_CUCUMBER_SUMMARY_ID);
		assertThat(this.featureSummary).hasDescription(BASIC_CUCUMBER_EXAMPLE_DESCRIPTION);
	}

	@Then("^the feature's scenarios are displayed with test status$")
	public void the_feature_s_scenarios_are_displayed_with_test_status() {
		assertThat(this.featureSummary).hasScenarios(BASIC_CUCUMBER_SCENARIOS);
	}

	@Then("^the scenario's steps are displayed with test status$")
	public void the_scenario_s_steps_are_displayed_with_test_status() {
		assertThat(this.scenarioSummary).hasSameStepsAs(this.expectedScenarioSummary);
	}

	@Then("^the scenario's testing tips, environment and execution notes are displayed$")
	public void the_scenario_s_testing_tips_environment_and_execution_notes_are_displayed() {
		assertThat(this.scenarioSummary).hasTestingTips(this.expectedScenarioSummary.getTestingTips());
		assertThat(this.scenarioSummary).hasEnvironment(this.expectedScenarioSummary.getEnvironment());
		assertThat(this.scenarioSummary).hasExecutionNotes(this.expectedScenarioSummary.getExecutionNotes());
	}

	@Then("^the stack traces for the scenario's failed step can be displayed$")
	public void the_stack_traces_for_the_scenario_s_failed_step_can_be_displayed() {
		assertThat(this.scenarioSummary).hasSameStepsAs(FAILED_SCENARIO);
	}

	@Then("^the scenario's steps are displayed with manual test status$")
	public void the_scenario_s_steps_are_displayed_with_manual_test_status() {
		assertThat(this.scenarioSummary).hasSameStepsAs(WITH_AN_ATTACHEMENT_SCENARIO);
	}

	@Then("^the feature should have scenarios$")
	public void the_feature_should_have_scenarios(final List<String> scenarios) {
		this.reportManager.openFeature(this.reportContext, "merging-reports-for-single-feature");
		final FeatureSummary feature = this.reportManager.getFeature();
		assertThat(feature.getScenarios()).extracting("name").containsAll(scenarios);
	}

	@Then("^the scenario's status is updated to passed$")
	public void the_scenario_s_status_is_updated_to_passed() {
		final ScenarioSummary scenario = this.reportManager.openScenario(this.reportContext, "merging-reports-for-single-feature",
				"scenario1");
		assertThat(scenario).hasResult("passed");
	}

	@Then("^accurate summary stats are returned$")
	public void accurate_summary_stats_are_returned() {
		accurate_summary_stats_per_scope_are_returned("feature");
	}
	
	@Then("^accurate summary stats per (.+)? are returned$")
	public void accurate_summary_stats_per_scope_are_returned(String scope) {
		Client userClient = JerseyClientFactory.getInstance().createAuthenticatingClient();
		final Response resp = userClient.target(this.xbddInstance.getBaseURL() + "rest/stats/build/"
				+ this.reportContext.getProduct() + "/" 
				+ this.reportContext.getMajorVersion() + "." 
				+ this.reportContext.getMinorVersion() + "."
				+ this.reportContext.getServicePackVersion() + "/"
				+ this.reportContext.getBuild()
				+ "/" + scope + "s").request().get();
		
		final String jsonTemplate = "{ \"automated\" : { \"p\" : %d , \"f\" : %d , \"s\" : %d , \"u\" : %d} , \"manual\" : { \"p\" : %d , \"f\" : %d , \"s\" : %d , \"u\" : %d}}";
		if (scope != null && scope.equals("scenario")) {
			assertThat(resp.readEntity(String.class), equalToIgnoringWhiteSpace(
					String.format(jsonTemplate, 4, 1, 0, 1, 0, 0, 0, 8)));
		} else {
			assertThat(resp.readEntity(String.class), equalToIgnoringWhiteSpace(
					String.format(jsonTemplate, 3, 1, 0, 0, 0, 0, 0, 4)));
		}
	}
}
