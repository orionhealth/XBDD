import React from "react";
import { List, ListItem, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { stepStyles } from "./styles/ScenarioListStyles";
import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from "@material-ui/icons";

const ScenarioStep = props => {
  const { title, steps, handleStepClicked, classes } = props;

  const iconMap = {
    passed: <CheckBox className={`${classes.scenarioStepStatusPassed} ${classes.cenarioStepStatusIcon}`} />,
    failed: <IndeterminateCheckBox className={`${classes.scenarioStepStatusFailed} ${classes.cenarioStepStatusIcon}`} />,
    undefined: <CheckBoxOutlineBlank className={classes.cenarioStepStatusIcon} />,
    skipped: <CheckBoxOutlineBlank className={classes.cenarioStepStatusIcon} />,
  };

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(step => (
          <ListItem button key={step.id} className={classes.step} onClick={() => handleStepClicked(step.id)}>
            <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
              <Grid item>{iconMap[step.status]}</Grid>
              <Grid item>
                <span className={classes.stepKeyword}>{step.keyword}</span>
                <span>{step.name}</span>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);
