import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep";
import ScenarioInputField from "./ScenarioInputField";

const calculateStatus = (backgroundSteps, steps) => {
  if (backgroundSteps) {
    const calculatedBackgroundStatus = backgroundSteps.find(step => {
      if (step.manualStatus) {
        return step.manualStatus !== "passed";
      } else {
        return step.status !== "passed";
      }
    });
    if (calculatedBackgroundStatus) {
      return calculatedBackgroundStatus.manualStatus ? calculatedBackgroundStatus.manualStatus : calculatedBackgroundStatus.status;
    }
  }
  if (steps) {
    const calculatedStatus = steps.find(step => {
      if (step.manualStatus) {
        return step.manualStatus !== "passed";
      } else {
        return step.status !== "passed";
      }
    });
    if (calculatedStatus) {
      return calculatedStatus.manualStatus ? calculatedStatus.manualStatus : calculatedStatus.status;
    }
  }
  return "passed";
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
    handleStatusChange,
    classes,
  } = props;

  return (
    <div className={classes.scenarioList}>
      {scenarioList.map(scenario => {
        const isExpanded = expandedScenarioIdList.includes(scenario.id);
        var className = isExpanded ? classes.expandedScenarioTitle : "";
        const calculatedStatus = calculateStatus(scenario.backgroundSteps, scenario.steps);
        const classesMap = {
          passed: classes.xbddScenarioPassed,
          failed: classes.xbddScenarioFailed,
          undefined: classes.xbddScenarioUndefined,
          skipped: classes.xbddScenarioSkipped,
          null: null,
        };
        className += ` ${classesMap[calculatedStatus]}`;

        const renderScenarioSteps = (title, steps) => (
          <ScenarioStep
            title={title}
            scenarioId={scenario.id}
            hoveredStepId={hoveredStepId}
            steps={steps}
            anchor={anchor}
            handleStepHovered={handleStepHovered}
            handleStepNotHovered={handleStepNotHovered}
            handleMoreButtonHovered={handleMoreButtonHovered}
            handleStatusChange={handleStatusChange}
          />
        );

        const renderScenarioComment = (label, value, placeholder) => (
          <ScenarioInputField
            id={scenario.id}
            label={label}
            value={value}
            handleScenarioCommentChanged={handleScenarioCommentChanged}
            placeholder={placeholder}
          />
        );

        return (
          <ExpansionPanel
            key={scenario.id}
            expanded={isExpanded}
            className={classes.scenarioListItem}
            TransitionProps={{ unmountOnExit: true }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={() => handleScenarioClicked(scenario.id)}>
              <Typography className={className}>{scenario.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                <Grid item xs={11}>
                  {scenario.backgroundSteps ? renderScenarioSteps("Background: ", scenario.backgroundSteps) : null}
                </Grid>
                <Grid item xs={11}>
                  {scenario.steps ? renderScenarioSteps("Steps: ", scenario.steps) : null}
                </Grid>
                <Grid item xs={5}>
                  {renderScenarioComment("Environment", scenario.environmentNotes, "Environment details go here...")}
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  {renderScenarioComment("Execution Notes", scenario.executionNotes, "Notes on your test execution go here...")}
                </Grid>
                <Grid item xs={11}>
                  {renderScenarioComment(
                    "Testing Tips",
                    scenario.testingTips,
                    "Any details / gotchas on manually testing this functionality go here. This will be carried forward in subsequent reports."
                  )}
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
      })}
    </div>
  );
};

export default withStyles(scenarioListStyles)(ScenarioList);
