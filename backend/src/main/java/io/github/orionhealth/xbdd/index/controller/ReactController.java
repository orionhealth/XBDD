package io.github.orionhealth.xbdd.index.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {
	// TODO - this might need to be on for deployed versions
	// @RequestMapping(value = { "/", "/rest/reports/{product}/{version}/{build}" })
	// public String index() {
	// return "index.html";
	// }

	@RequestMapping(value = { "/" })
	public String index() {
		// TODO - this should only be turned on for the dev profile
		return "redirect:http://localhost:3000";
	}
}
