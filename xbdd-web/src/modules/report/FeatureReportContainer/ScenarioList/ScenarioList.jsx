import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { scenarioListStyles } from "./styles/ScenarioListStyles";
import { ExpandMore } from "@material-ui/icons";
import ScenarioStep from "./ScenarioStep";
import ScenarioInputField from "./ScenarioInputField";

const ScenarioList = props => {
  const { scenarioList, expandedScenarioList, handleScenarioClicked, classes } = props;

  console.error(scenarioList);
  return (
    <div className={classes.scenarioList}>
      {scenarioList.map(scenario => (
        <ExpansionPanel key={scenario.id} expanded={expandedScenarioList.includes(scenario.id)} className={classes.scenarioListItem}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={() => handleScenarioClicked(scenario.id)}>
            <Typography>{scenario.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ textAlign: "left" }}>
            <Grid container>
              <Grid item xs={5}>
                {scenario.background ? <ScenarioStep title={"Background: "} steps={scenario.background.steps} /> : null}
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={5}>
                {scenario.background ? <ScenarioStep title={"Steps: "} steps={scenario.steps} /> : null}
              </Grid>
              <Grid item xs={5}>
                <ScenarioInputField label="Environment" placeholder={"Environment details go here..."} />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={5}>
                <ScenarioInputField label="Execution Notes" placeholder={"Notes on your test execution go here..."} />
              </Grid>
              <Grid item xs={11}>
                <ScenarioInputField
                  label="Testing Tips"
                  placeholder={
                    "Any details / gotchas on manually testing this functionality go here. This will be carried forward in subsequent reports."
                  }
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
      ))}
    </div>
  );
};

export default withStyles(scenarioListStyles)(ScenarioList);
