package io.github.orionhealth.xbdd.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.github.orionhealth.xbdd.model.junit.JUnitElement;
import io.github.orionhealth.xbdd.model.junit.JUnitEmbedding;
import io.github.orionhealth.xbdd.model.junit.JUnitFeature;
import io.github.orionhealth.xbdd.model.junit.JUnitStep;
import io.github.orionhealth.xbdd.model.junit.JUnitStepResult;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;
import io.github.orionhealth.xbdd.model.xbdd.XbddStep;
import io.github.orionhealth.xbdd.model.xbdd.XbddStepResult;
import io.github.orionhealth.xbdd.persistence.ImageDao;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.StatusHelper;

public class FeatureMapper {

	private final ImageDao imageDao;

	public FeatureMapper(final ImageDao imageDao) {
		this.imageDao = imageDao;
	}

	public static Stream<String> getStepStatusStream(final XbddScenario element) {
		final List<XbddStep> allSteps = new ArrayList<>();

		if (element.getBackground() != null) {
			allSteps.addAll(element.getBackground().getSteps());
		}

		allSteps.addAll(element.getSteps());

		return allSteps.stream().map(step -> step.getResult().getStatus()).filter(Objects::nonNull);
	}

	public static void setFeatureStatus(final XbddFeature xbddFeature) {
		final List<String> allStatuses = xbddFeature.getElements().stream()
				.flatMap(FeatureMapper::getStepStatusStream)
				.collect(Collectors.toList());

		final String status = StatusHelper.reduceStatuses(allStatuses).getTextName();
		xbddFeature.setOriginalAutomatedStatus(status);
		xbddFeature.setCalculatedStatus(status);
	}

	public XbddFeature map(final JUnitFeature jUnitFeature, final Coordinates coordinates) {
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
		for (final JUnitElement element : jUnitFeature.getElements()) {
			final XbddScenario scenario = mapScenario(element, coordinates, jUnitFeature.getId());

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

		FeatureMapper.setFeatureStatus(xbddFeature);

		return xbddFeature;
	}

	private XbddScenario mapScenario(final JUnitElement jUnitElement, final Coordinates coordinates, final String featureId) {
		final XbddScenario xbddScenario = new XbddScenario();

		xbddScenario.setOriginalId(jUnitElement.getId());
		xbddScenario.setDescription(jUnitElement.getDescription());
		xbddScenario.setKeyword(jUnitElement.getKeyword());
		xbddScenario.setLine(jUnitElement.getLine());
		xbddScenario.setName(jUnitElement.getName());
		xbddScenario.setType(jUnitElement.getType());

		xbddScenario.setTags(jUnitElement.getTags());

		xbddScenario.setSteps(
				jUnitElement.getSteps().stream().map(step -> mapStep(step, coordinates, featureId, xbddScenario.getOriginalId()))
						.collect(
								Collectors.toList()));

		return xbddScenario;
	}

	private XbddStep mapStep(final JUnitStep jUnitStep, final Coordinates coordinates, final String featureId, final String scenarioId) {
		final XbddStep xbddStep = new XbddStep();

		xbddStep.setName(jUnitStep.getName());
		xbddStep.setLine(jUnitStep.getLine());
		xbddStep.setKeyword(jUnitStep.getKeyword());
		xbddStep.setMatchedColumns(jUnitStep.getMatchedColumns());
		xbddStep.setMatch(jUnitStep.getMatch());
		xbddStep.setResult(mapResult(jUnitStep.getResult()));
		xbddStep.setRows(jUnitStep.getRows());

		mapEmbeddings(jUnitStep, xbddStep, coordinates, featureId, scenarioId);

		return xbddStep;
	}

	private XbddStepResult mapResult(final JUnitStepResult jUnitStepResult) {
		final XbddStepResult xbddStepResult = new XbddStepResult();

		xbddStepResult.setDuration(jUnitStepResult.getDuration());
		xbddStepResult.setError_message(jUnitStepResult.getError_message());
		xbddStepResult.setStatus(jUnitStepResult.getStatus());

		return xbddStepResult;
	}

	private void mapEmbeddings(final JUnitStep junitStep, final XbddStep xbddStep, final Coordinates coordinates, final String featureId,
			final String scenarioId) {
		xbddStep.setEmbeddings(new ArrayList<>());
		for (final JUnitEmbedding embedding : junitStep.getEmbeddings()) {
			final String filename = this.imageDao.saveImageAndReturnFilename(embedding, coordinates, featureId, scenarioId);
			if (filename != null) {
				xbddStep.getEmbeddings().add(filename);
			}
		}
	}
}
