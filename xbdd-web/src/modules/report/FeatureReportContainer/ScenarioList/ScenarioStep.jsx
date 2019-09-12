import React from "react";
import { List, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { stepStyles } from "./styles/ScenarioListStyles";

const ScenarioStep = props => {
  const { title, steps, classes } = props;

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(step => (
          <ListItem key={step.name} className={classes.step}>
            <span className={classes.stepKeyword}>{step.keyword}</span>
            <span>{step.name}</span>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);
