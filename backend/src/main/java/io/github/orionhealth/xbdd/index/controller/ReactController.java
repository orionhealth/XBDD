package io.github.orionhealth.xbdd.index.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {

	@RequestMapping(value = { "/reports/{product}/{version}/{build}" })
	public String mapToReact() {
		return "/index.html";
	}

	// This is needed for dev, doesn't affect the deployed version.
	@RequestMapping(value = { "/" })
	public String mapToDevReact() {
		return "redirect:http://localhost:3000";
	}
}
