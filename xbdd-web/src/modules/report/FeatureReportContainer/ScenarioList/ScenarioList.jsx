import React from "react";
import PropTypes from "prop-types";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep";
import ScenarioInputField from "./ScenarioInputField";
import Scenario from "../../../../models/Scenario";

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
    />
  );

  const renderScenarioComment = (scenarioId, label, value, placeholder) => (
    <ScenarioInputField
      id={scenarioId}
      label={label}
      value={value}
      handleScenarioCommentChanged={handleScenarioCommentChanged}
      placeholder={placeholder}
    />
  );

  const renderButton = (scenarioId, value, status, handler, className) => (
    <Button variant="contained" size="small" onClick={() => handler(scenarioId, null, status)} className={className}>
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
          null: null,
        };
        className += ` ${classesMap[scenario.calculatedStatus]}`;

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
                    {renderButton(id, "Skip All Steps", "skipped", handleStatusChange, classes.skipAllSteps)}
                    {renderButton(id, "Pass All Steps", "passed", handleStatusChange, classes.passAllSteps)}
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
  anchor: PropTypes.string,
  handleScenarioClicked: PropTypes.func.isRequired,
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  handleStepHovered: PropTypes.func.isRequired,
  handleStepNotHovered: PropTypes.func.isRequired,
  handleMoreButtonHovered: PropTypes.func.isRequired,
  handleMoreButtonNotHovered: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(scenarioListStyles)(ScenarioList);
