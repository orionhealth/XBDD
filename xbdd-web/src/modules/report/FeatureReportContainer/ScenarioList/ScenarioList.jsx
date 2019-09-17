import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep";
import ScenarioInputField from "./ScenarioInputField";

const calculateStatus = steps => {
  const calculatedStatus = steps.find(step => {
    if (step.manualStatus) {
      return step.manualStatus !== "passed";
    } else {
      return step.status !== "passed";
    }
  });
  return calculatedStatus ? calculatedStatus.status : "passed";
};

const renderScenarioReport = (
  scenario,
  expandedScenarioIdList,
  hoveredStepId,
  anchor,
  handleScenarioClicked,
  handleScenarioCommentChanged,
  handleMouseEnterStep,
  handleMouseLeaveStep,
  handleMoreButtonClicked,
  handleStatusChange,
  classes
) => {
  const isExpanded = expandedScenarioIdList.includes(scenario.id);
  var className = isExpanded ? classes.expandedScenarioTitle : "";
  const calculatedStatus = scenario.steps ? calculateStatus(scenario.steps) : null;
  const classesMap = {
    passed: classes.xbddScenarioPassed,
    failed: classes.xbddScenarioFailed,
    undefined: classes.xbddScenarioUndefined,
    skipped: classes.xbddScenarioSkipped,
    null: null,
  };
  className += ` ${classesMap[calculatedStatus]}`;

  return (
    <ExpansionPanel key={scenario.id} expanded={isExpanded} className={classes.scenarioListItem} TransitionProps={{ unmountOnExit: true }}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={() => handleScenarioClicked(scenario.id)}>
        <Typography className={className}>{scenario.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={11}>
            {scenario.backgroundSteps ? (
              <ScenarioStep
                title={"Background: "}
                hoveredStepId={hoveredStepId}
                steps={scenario.backgroundSteps}
                anchor={anchor}
                handleMouseEnterStep={handleMouseEnterStep}
                handleMouseLeaveStep={handleMouseLeaveStep}
                handleMoreButtonClicked={handleMoreButtonClicked}
                handleStatusChange={handleStatusChange}
              />
            ) : null}
          </Grid>
          <Grid item xs={11}>
            {scenario.steps ? (
              <ScenarioStep
                title={"Steps: "}
                hoveredStepId={hoveredStepId}
                steps={scenario.steps}
                anchor={anchor}
                handleMouseEnterStep={handleMouseEnterStep}
                handleMouseLeaveStep={handleMouseLeaveStep}
                handleMoreButtonClicked={handleMoreButtonClicked}
                handleStatusChange={handleStatusChange}
              />
            ) : null}
          </Grid>
          <Grid item xs={5}>
            <ScenarioInputField
              id={scenario.id}
              label="Environment"
              value={scenario.environmentNotes}
              handleScenarioCommentChanged={handleScenarioCommentChanged}
              placeholder="Environment details go here..."
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={5}>
            <ScenarioInputField
              id={scenario.id}
              label="Execution Notes"
              value={scenario.executionNotes}
              handleScenarioCommentChanged={handleScenarioCommentChanged}
              placeholder="Notes on your test execution go here..."
            />
          </Grid>
          <Grid item xs={11}>
            <ScenarioInputField
              id={scenario.id}
              label="Testing Tips"
              value={scenario.testingTips}
              handleScenarioCommentChanged={handleScenarioCommentChanged}
              placeholder="Any details / gotchas on manually testing this functionality go here. This will be carried forward in subsequent reports."
            />
          </Grid>
          <Grid item xs={11}>
            <div className={classes.buttons}>
              <Button variant="contained" size="small" className={classes.cancelButton}>
                Cancel
              </Button>
              <Button variant="contained" size="small" className={classes.submitButton}>
                Submit
              </Button>
            </div>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const ScenarioList = props => {
  const {
    scenarioList,
    expandedScenarioIdList,
    hoveredStepId,
    anchor,
    handleScenarioClicked,
    handleScenarioCommentChanged,
    handleMouseEnterStep,
    handleMouseLeaveStep,
    handleMoreButtonClicked,
    handleStatusChange,
    classes,
  } = props;

  return (
    <div className={classes.scenarioList}>
      {scenarioList.map(scenario =>
        renderScenarioReport(
          scenario,
          expandedScenarioIdList,
          hoveredStepId,
          anchor,
          handleScenarioClicked,
          handleScenarioCommentChanged,
          handleMouseEnterStep,
          handleMouseLeaveStep,
          handleMoreButtonClicked,
          handleStatusChange,
          classes
        ))}
    </div>
  );
};

export default withStyles(scenarioListStyles)(ScenarioList);
