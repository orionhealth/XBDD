package xbdd.mappers;

import org.apache.log4j.Logger;
import xbdd.model.junit.*;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddScenario;
import xbdd.model.xbdd.XbddStep;
import xbdd.model.xbdd.XbddStepResult;
import xbdd.persistence.ImageDao;
import xbdd.util.Coordinates;
import xbdd.util.StatusHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class FeatureMapper {

	private static final Logger LOGGER = Logger.getLogger(FeatureMapper.class);

	public static Stream<String> getStepStatusStream(XbddScenario element) {
		List<XbddStep> allSteps = new ArrayList<>();

		if (element.getBackground() != null) {
			allSteps.addAll(element.getBackground().getSteps());
		}

		if (element.getSteps() != null) {
			allSteps.addAll(element.getSteps());
		}

		return allSteps.stream().map(step -> step.getResult().getStatus()).filter(status -> status != null);
	}

	private final ImageDao imageDao;

	public FeatureMapper(ImageDao imageDao) {
		this.imageDao = imageDao;
	}

	public XbddFeature map(JUnitFeature jUnitFeature, Coordinates coordinates) {
		final XbddFeature xbddFeature = new XbddFeature();
		xbddFeature.setOriginalId(jUnitFeature.getId());
		xbddFeature.setDescription(jUnitFeature.getDescription());
		xbddFeature.setKeyword(jUnitFeature.getKeyword());
		xbddFeature.setLine(jUnitFeature.getLine());
		xbddFeature.setName(jUnitFeature.getName());
		xbddFeature.setUri(jUnitFeature.getUri());
		xbddFeature.setCoordinates(CoordinatesMapper.mapCoordinates(coordinates));
		xbddFeature.setTags(jUnitFeature.getTags());

		// take each feature and give it a unique id.
		final String _id = coordinates.getFeature_Id(jUnitFeature.getId());
		xbddFeature.setId(_id);

		xbddFeature.setElements(new ArrayList<>());

		XbddScenario background = null;
		for (JUnitElement element : jUnitFeature.getElements()) {
			XbddScenario scenario = mapScenario(element, coordinates, jUnitFeature.getId());

			if ("background".equals(scenario.getType())) {
				background = scenario;
			} else {
				if (background != null) {
					scenario.setBackground(background);
					background = null;
				}
				xbddFeature.getElements().add(scenario);
			}

		}

		List<String> allStatuses = xbddFeature.getElements().stream()
				.flatMap(FeatureMapper::getStepStatusStream)
				.collect(Collectors.toList());

		String status = StatusHelper.reduceStatuses(allStatuses).getTextName();
		xbddFeature.setOriginalAutomatedStatus(status);
		xbddFeature.setCalculatedStatus(status);

		return xbddFeature;
	}

	private XbddScenario mapScenario(JUnitElement jUnitElement, Coordinates coordinates, String featureId) {
		XbddScenario xbddScenario = new XbddScenario();

		xbddScenario.setOriginalId(jUnitElement.getId());
		xbddScenario.setDescription(jUnitElement.getDescription());
		xbddScenario.setKeyword(jUnitElement.getKeyword());
		xbddScenario.setLine(jUnitElement.getLine());
		xbddScenario.setName(jUnitElement.getName());
		xbddScenario.setType(jUnitElement.getType());
		xbddScenario.setTags(jUnitElement.getTags());

		if (jUnitElement.getSteps() != null) {
			xbddScenario.setSteps(
					jUnitElement.getSteps().stream().map(step -> mapStep(step, coordinates, featureId, xbddScenario.getOriginalId())).collect(
							Collectors.toList()));
		}

		return xbddScenario;
	}

	private XbddStep mapStep(JUnitStep jUnitStep, Coordinates coordinates, String featureId, String scenarioId) {
		XbddStep xbddStep = new XbddStep();

		xbddStep.setName(jUnitStep.getName());
		xbddStep.setLine(jUnitStep.getLine());
		xbddStep.setKeyword(jUnitStep.getKeyword());
		xbddStep.setMatchedColumns(jUnitStep.getMatchedColumns());
		xbddStep.setMatch(jUnitStep.getMatch());
		xbddStep.setResult(mapResult(jUnitStep.getResult()));

		mapEmbeddings(jUnitStep, xbddStep, coordinates, featureId, scenarioId);

		return xbddStep;
	}

	private XbddStepResult mapResult(JUnitStepResult jUnitStepResult) {
		XbddStepResult xbddStepResult = new XbddStepResult();

		xbddStepResult.setDuration(jUnitStepResult.getDuration());
		xbddStepResult.setError_message(jUnitStepResult.getError_message());
		xbddStepResult.setStatus(jUnitStepResult.getStatus());

		return xbddStepResult;
	}

	private void mapEmbeddings(JUnitStep junitStep, XbddStep xbddStep, Coordinates coordinates, String featureId, String scenarioId) {
		if (junitStep.getEmbeddings() != null) {
			for (JUnitEmbedding embedding : junitStep.getEmbeddings()) {
				String filename = this.imageDao.saveImageAndReturnFilename(embedding, coordinates, featureId, scenarioId);
				if (filename != null) {
					xbddStep.getEmbeddings().add(filename);
				}
			}
		}
	}
}
