package io.github.orionhealth.xbdd;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.message.GZipEncoder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.server.TracingConfig;
import org.glassfish.jersey.server.filter.EncodingFilter;
import org.springframework.stereotype.Component;

import io.github.orionhealth.xbdd.resources.AdminUtils;
import io.github.orionhealth.xbdd.resources.Attachment;
import io.github.orionhealth.xbdd.resources.AutomationStatistics;
import io.github.orionhealth.xbdd.resources.BuildReOrdering;
import io.github.orionhealth.xbdd.resources.Environment;
import io.github.orionhealth.xbdd.resources.Favourites;
import io.github.orionhealth.xbdd.resources.Feature;
import io.github.orionhealth.xbdd.resources.MergeBuilds;
import io.github.orionhealth.xbdd.resources.Presence;
import io.github.orionhealth.xbdd.resources.PrintPDF;
import io.github.orionhealth.xbdd.resources.Recents;
import io.github.orionhealth.xbdd.resources.Report;
import io.github.orionhealth.xbdd.resources.Search;
import io.github.orionhealth.xbdd.resources.Stats;
import io.github.orionhealth.xbdd.resources.TagView;
import io.github.orionhealth.xbdd.resources.UploadAttachment;
import io.github.orionhealth.xbdd.resources.UserResource;

@Component
@ApplicationPath("/rest")
public class JerseyApplication extends ResourceConfig {

	public JerseyApplication() {

		// Need to register all resources manually as spring fat jar doesn't like the resource scanning
		register(AdminUtils.class);
		register(Attachment.class);
		register(AutomationStatistics.class);
		register(BuildReOrdering.class);
		register(Environment.class);
		register(Favourites.class);
		register(Feature.class);
		register(MergeBuilds.class);
		register(Presence.class);
		register(PrintPDF.class);
		register(Recents.class);
		register(Report.class);
		register(Search.class);
		register(Stats.class);
		register(TagView.class);
		register(UploadAttachment.class);
		register(UserResource.class);

		EncodingFilter.enableFor(this, GZipEncoder.class);

		register(MultiPartFeature.class);

		property(ServerProperties.TRACING, TracingConfig.ON_DEMAND.name());
	}
}
