import React from "react";
import PropTypes from "prop-types";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep/ScenarioStep";
import ScenarioInputField from "./ScenarioStep/ScenarioInputField";
import Scenario from "models/Scenario";
import StatusIcons from "../FeatureSummary/StatusIcons";

const addStepsStatus = (statusMap, steps, status) => {
  steps.forEach(step => {
    if (!status) {
      const finalStatus = step.manualStatus ? step.manualStatus : step.status;
      statusMap.push({ stepId: step.id, status: finalStatus });
    } else {
      statusMap.push({ stepId: step.id, status: status });
    }
  });
};

const generateStatusMap = (scenario, status) => {
  const statusMap = [];
  if (scenario.backgroundSteps) {
    addStepsStatus(statusMap, scenario.backgroundSteps, status);
  }
  if (scenario.steps) {
    addStepsStatus(statusMap, scenario.steps, status);
  }
  return statusMap;
};

const ScenarioList = props => {
  const {
    scenarioList,
    expandedScenarioIdList,
    hoveredStepId,
    anchor,
    handleScenarioClicked,
    handleScenarioCommentChanged,
    handleStepHovered,
    handleStepNotHovered,
    handleMoreButtonHovered,
    handleMoreButtonNotHovered,
    handleStatusChange,
    handleScreenshotClicked,
    classes,
  } = props;

  const renderScenarioSteps = (scenarioId, title, steps) => (
    <ScenarioStep
      title={title}
      scenarioId={scenarioId}
      hoveredStepId={hoveredStepId}
      steps={steps}
      anchor={anchor}
      handleStepHovered={handleStepHovered}
      handleStepNotHovered={handleStepNotHovered}
      handleMoreButtonHovered={handleMoreButtonHovered}
      handleMoreButtonNotHovered={handleMoreButtonNotHovered}
      handleStatusChange={handleStatusChange}
      handleScreenshotClicked={handleScreenshotClicked}
    />
  );

  const renderScenarioComment = (scenarioId, label, value, placeholder) => (
    <ScenarioInputField
      scenarioId={scenarioId}
      label={label}
      value={value}
      handleScenarioCommentChanged={handleScenarioCommentChanged}
      placeholder={placeholder}
    />
  );

  const renderButton = (id, value, scenario, status, classes) => (
    <Button
      variant="contained"
      size="small"
      onClick={() => handleStatusChange(id, generateStatusMap(scenario), generateStatusMap(scenario, status))}
      className={classes}
    >
      {value}
    </Button>
  );

  return (
    <div className={classes.scenarioList}>
      {scenarioList.map(scenario => {
        const id = scenario.id;
        const isExpanded = expandedScenarioIdList.includes(scenario.id);
        var className = isExpanded ? classes.expandedScenarioTitle : "";
        const classesMap = {
          passed: classes.xbddScenarioPassed,
          failed: classes.xbddScenarioFailed,
          undefined: classes.xbddScenarioUndefined,
          skipped: classes.xbddScenarioSkipped,
        };
        if (scenario.calculatedStatus) {
          className += ` ${classesMap[scenario.calculatedStatus]}`;
        } else {
          className += ` ${classesMap[scenario.originalAutomatedStatus]}`;
        }

        return (
          <ExpansionPanel key={id} expanded={isExpanded} className={classes.scenarioListItem} TransitionProps={{ unmountOnExit: true }}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={() => handleScenarioClicked(scenario.id)}>
              <Box display="flex" alignItems="center">
                <Box p={1} className={classes.statusIconsBox}>
                  <StatusIcons
                    firstStatus={scenario.originalAutomatedStatus}
                    secondStatus={scenario.calculatedStatus ? scenario.calculatedStatus : scenario.originalAutomatedStatus}
                    size="small"
                  />
                </Box>
                <Box p={1} className={classes.scenarioTitleBox}>
                  <Typography className={className}>{scenario.name}</Typography>
                </Box>
              </Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                <Grid item xs={11}>
                  {scenario.backgroundSteps ? renderScenarioSteps(id, "Background: ", scenario.backgroundSteps) : null}
                </Grid>
                <Grid item xs={11}>
                  {scenario.steps ? renderScenarioSteps(id, "Steps: ", scenario.steps) : null}
                </Grid>
                <Grid item xs={5}>
                  {renderScenarioComment(id, "Environment", scenario.environmentNotes, "Environment details go here...")}
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  {renderScenarioComment(id, "Execution Notes", scenario.executionNotes, "Notes on your test execution go here...")}
                </Grid>
                <Grid item xs={11}>
                  {renderScenarioComment(
                    id,
                    "Testing Tips",
                    scenario.testingTips,
                    "Any details / gotchas on manually testing this functionality go here. This will be carried forward in subsequent reports."
                  )}
                </Grid>
                <Grid item xs={11}>
                  <div className={classes.buttons}>
                    {renderButton(id, "Skip All Steps", scenario, "skipped", classes.skipAllSteps)}
                    {renderButton(id, "Pass All Steps", scenario, "passed", classes.passAllSteps)}
                  </div>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

ScenarioList.propTypes = {
  scenarioList: PropTypes.arrayOf(PropTypes.instanceOf(Scenario)),
  expandedScenarioIdList: PropTypes.arrayOf(PropTypes.string),
  hoveredStepId: PropTypes.string,
  anchor: PropTypes.object,
  handleScenarioClicked: PropTypes.func.isRequired,
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  handleStepHovered: PropTypes.func.isRequired,
  handleStepNotHovered: PropTypes.func.isRequired,
  handleMoreButtonHovered: PropTypes.func.isRequired,
  handleMoreButtonNotHovered: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleScreenshotClicked: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(scenarioListStyles)(ScenarioList);
