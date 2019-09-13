import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep";
import ScenarioInputField from "./ScenarioInputField";

const ScenarioList = props => {
  const { scenarioList, expandedScenarioList, handleScenarioClicked, handleStepClicked, handleScenarioCommentChanged, classes } = props;

  console.error(scenarioList);
  return (
    <div className={classes.scenarioList}>
      {scenarioList.map(scenario => {
        const expanded = expandedScenarioList.includes(scenario.id);

        return (
          <ExpansionPanel key={scenario.id} expanded={expanded} className={classes.scenarioListItem}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={() => handleScenarioClicked(scenario.id)}>
              <Typography className={expanded ? classes.expandedScenarioTitle : null}>{scenario.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ textAlign: "left" }}>
              <Grid container>
                <Grid item xs={11}>
                  {scenario.backgroundSteps ? (
                    <ScenarioStep title={"Background: "} steps={scenario.backgroundSteps} handleStepClicked={handleStepClicked} />
                  ) : null}
                </Grid>
                <Grid item xs={11}>
                  {scenario.steps ? <ScenarioStep title={"Steps: "} steps={scenario.steps} handleStepClicked={handleStepClicked} /> : null}
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
      })}
    </div>
  );
};

export default withStyles(scenarioListStyles)(ScenarioList);
