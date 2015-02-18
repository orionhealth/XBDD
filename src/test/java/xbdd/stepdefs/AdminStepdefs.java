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

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import xbdd.XbddDriver;
import xbdd.utils.JerseyClientFactory;
import xbdd.utils.XBDDInstance;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class AdminStepdefs {

	private final WebDriver webDriver;
	private final XBDDInstance xbddInstance;
	private final Client adminClient;
	private final Client userClient;
	private String originalProductName;
	private String newProductName;
	private int ProductQuant;
	private Response renameResp;
	private Client client;

	public AdminStepdefs(final XbddDriver driver, final XBDDInstance xbddInstance) {
		this.webDriver = driver;
		this.xbddInstance = xbddInstance;
		this.adminClient = JerseyClientFactory.getInstance().createAdminAuthenticatingClient();
		this.userClient = JerseyClientFactory.getInstance().createAuthenticatingClient();
		this.client = this.adminClient;
	}

	@When("^a rename request is sent$")
	public void a_rename_request_is_sent() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.elementToBeClickable(By.cssSelector(".product-action-menu button")));
		this.originalProductName = this.webDriver.findElement(By.cssSelector(".product-link")).getAttribute("innerHTML");
		this.renameResp = this.client.target(this.xbddInstance.getBaseURL() + "rest/admin/" + this.originalProductName)
				.request(MediaType.APPLICATION_JSON_TYPE).put(Entity.json("{\"name\": \"" + this.newProductName + "\"}"));
	}

	@When("^the new name is set to an unique name$")
	public void the_new_name_is_set_to_an_unique_name() {
		this.newProductName = "test-rename" + (System.currentTimeMillis());
	}

	@When("^the new name is set to an already existing name$")
	public void the_new_name_is_set_to_an_already_existing_name() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.elementToBeClickable(By.cssSelector(".product-action-menu button")));
		this.newProductName = this.webDriver.findElement(By.cssSelector(".product-link")).getAttribute("innerHTML");
	}

	@When("^the user deletes the test report$")
	public void the_user_deletes_the_test_report() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.elementToBeClickable(By.cssSelector(".product-action-menu button")));
		this.ProductQuant = this.webDriver.findElements(By.cssSelector(".delete-product")).size();
		final String ProductName = this.webDriver.findElement(By.cssSelector(".product-link")).getAttribute("innerHTML");
		final WebTarget webTarget = this.client.target(this.xbddInstance.getBaseURL() + "rest/admin/delete/" + ProductName);
		webTarget.request().delete();
	}

	@When("^the client is a user$")
	public void the_client_is_a_user() {
		this.client = this.userClient;
	}

	@When("^the client is an admin$")
	public void the_client_is_an_admin() {
		this.client = this.adminClient;
	}

	@Then("^all references to the old product are removed$")
	public void all_references_to_the_old_product_are_removed() {
		final Response resp = this.userClient
				.target(this.xbddInstance.getBaseURL() + "rest/reports/featureIndex/" + this.originalProductName + "/1.0.0/1").request()
				.get();
		assertThat(resp.readEntity(String.class), is("[ ]"));
	}

	@Then("^references to the new product are added$")
	public void references_to_the_new_product_are_added() {
		final Response resp = this.userClient
				.target(this.xbddInstance.getBaseURL() + "rest/reports/featureIndex/" + this.newProductName + "/1.0.0/1").request().get();
		assertThat(resp.readEntity(String.class), is(not("[ ]")));
	}

	@Then("^the delete option is not visible$")
	public void the_delete_option_is_not_visible() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".page-zone h2")));
		assertThat(this.webDriver.findElements(By.cssSelector(".delete-product")).size(), is(0));
	}

	@Then("^the report for the product is no longer available$")
	public void the_report_for_the_product_is_no_longer_available() {
		this.webDriver.navigate().to(this.xbddInstance.getBaseURL());
		new WebDriverWait(this.webDriver, 10).until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".products-container")));
		assertThat(this.webDriver.findElements(By.cssSelector(".delete-product")).size(), is(this.ProductQuant - 1));
	}

	@Then("^the request succeeds$")
	public void the_request_succeeds() {
		assertThat(this.renameResp.getStatus(), is(200));
	}

	@Then("^the request fails$")
	public void the_request_fails() {
		assertThat(this.renameResp.getStatus(), is(500));
	}
}
