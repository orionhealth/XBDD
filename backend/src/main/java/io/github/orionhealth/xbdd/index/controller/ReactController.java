package io.github.orionhealth.xbdd.index.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {
	@RequestMapping(value = { "/", "/redirect", "/reports/{product}/{version}/{build}" })
	public String index() {
		return "index.html";
	}
}
