package io.github.orionhealth.xbdd.dev;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Profile("dev")
@Controller
public class LocalhostRedirectController {
	@RequestMapping(value = { "/" })
	public String mapToDevReact() {
		return "redirect:http://localhost:3000";
	}
}
