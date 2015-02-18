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

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import xbdd.XbddDriver;
import xbdd.utils.XBDDInstance;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class AccessStepdefs {

	private final WebDriver webDriver;
	private final XBDDInstance xbddInstance;

	public AccessStepdefs(final XbddDriver driver, final XBDDInstance xbddInstance) {
		this.webDriver = driver;
		this.xbddInstance = xbddInstance;
	}

	@Given("^xbdd server is running$")
	public void xbdd_server_is_running() {
		// duh
	}

	@Given("^the user is logged in$")
	public void the_user_is_logged_in() {
		login("test", "password");
	}

	@Given("^the admin is logged in$")
	public void the_admin_is_logged_in() {
	    login("admin", "password");
	}

	@When("^the user logs out$")
	public void the_user_logs_out() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL() + "/logout");
	}

	@When("^the user enter wrong credentials$")
	public void the_user_enter_wrong_credentials() {
		login("test", "wrong");
	}

	@When("^the user enter correct credentials$")
	public void the_user_enter_correct_credentials() {
		login("test", "password");
	}

	@When("^the session is invalidated$")
	public void the_session_is_invalidated() {
		if (this.webDriver instanceof JavascriptExecutor) {
			((JavascriptExecutor) this.webDriver).executeScript("YUI().use('statusHelpers','io-base', function(Y) { "
					+ "Y.io(Y.statusHelpers.getContext()+'/logout', { method: 'GET' }); });");
		}
	}

	@When("^the user attempts an ajax request$")
	public void the_user_attempts_an_ajax_request() {
		this.webDriver.manage().timeouts().implicitlyWait(50, TimeUnit.MILLISECONDS);
		if (this.webDriver instanceof JavascriptExecutor) {
			((JavascriptExecutor) this.webDriver)
					.executeScript("YUI().use('node', 'statusHelpers','io-base', 'session-timeout', 'handlebars', 'xbdd', function(Y) { Y.io(Y.statusHelpers.getContext(), { method: 'GET' }); });");
		}
	}

	@Then("^the user is prompted to enter user credentials again$")
	public void the_user_is_prompted_to_enter_user_credentials_again() {
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector(".text-plain"),
				"Please enter log-in details"));
	}

	@Then("^the user cannot login$")
	public void the_user_cannot_login() {
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector(".form-error-text"),
				"Login attempt failed."));
	}

	@Then("^the user can login$")
	public void the_user_can_login() {
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector("h1"),
				"Welcome to XBDD"));
	}

	@Then("^the user can access xbdd$")
	public void the_user_can_access_xbdd() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector("a"), "XBDD"));
	}

	@Then("^a login dialog is displayed$")
	public void a_login_dialog_is_displayed() {
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.id("session-timeout-iframe")));
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.visibilityOfElementLocated(By.id("j_username")));
	}

	@Then("^the user can log in again$")
	public void the_user_can_log_in_again() {
		login("test", "password");
	}

	@Then("^the user can make ajax requests$")
	public void the_user_can_make_ajax_requests() {
		this.webDriver.switchTo().defaultContent();
		if (this.webDriver instanceof JavascriptExecutor) {
			((JavascriptExecutor) this.webDriver)
					.executeScript("YUI().use('node', 'statusHelpers','io-base', 'session-timeout', 'handlebars', 'xbdd', function(Y) { Y.io(Y.statusHelpers.getContext(), { method: 'GET', on: { success: function() { document.body.innerHTML = '<span id=testspanresult>TEST SUCCESS</span>'; } } }); });");
		}
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.elementToBeClickable(By.cssSelector("#testspanresult")));
	}

	private void login(final String username, final String password) {
		// navigate to landing page if the login form is not visible
		if (this.webDriver.findElements(By.id("j_username")).size() == 0) {
			the_user_can_access_xbdd();
		}
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#j_username"))).sendKeys(username);
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#j_password"))).sendKeys(password);
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-login"))).click();
	}
}
