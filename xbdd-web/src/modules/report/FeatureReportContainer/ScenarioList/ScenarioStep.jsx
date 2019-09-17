import React from "react";
import { List, ListItem, Grid, Popper, IconButton, Fade, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { stepStyles } from "./styles/ScenarioListStyles";
import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox, MoreHoriz } from "@material-ui/icons";

const getNextHandler = (step, handleStatusChange) => {
  const handlerMap = {
    passed: () => handleStatusChange(step.id, "failed"),
    failed: () => handleStatusChange(step.id, null),
    null: () => handleStatusChange(step.id, "passed"),
  };
  return handlerMap[step.manualStatus];
};

const renderMoreButton = (step, anchor, handleMoreButtonClicked, handleStatusChange, classes) => (
  <>
    <IconButton className={classes.moreButton} onClick={e => handleMoreButtonClicked(e)}>
      <MoreHoriz className={classes.scenarioStepIcon} />
    </IconButton>
    <Popper open={anchor ? true : false} anchorEl={anchor} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <List>
              <ListItem button onClick={() => handleStatusChange(step.id, "passed")}>
                Pass
              </ListItem>
              <ListItem button onClick={() => handleStatusChange(step.id, "failed")}>
                Fail
              </ListItem>
              <ListItem button onClick={() => handleStatusChange(step.id, "skipped")}>
                Skip
              </ListItem>
            </List>
          </Paper>
        </Fade>
      )}
    </Popper>
  </>
);

const ScenarioStep = props => {
  const {
    title,
    steps,
    hoveredStepId,
    anchor,
    handleMouseEnterStep,
    handleMouseLeaveStep,
    handleMoreButtonClicked,
    handleStatusChange,
    classes,
  } = props;

  const iconMap = {
    passed: <CheckBox className={`${classes.scenarioStepStatusPassed} ${classes.scenarioStepIcon}`} />,
    failed: <IndeterminateCheckBox className={`${classes.scenarioStepStatusFailed} ${classes.scenarioStepIcon}`} />,
    undefined: <CheckBoxOutlineBlank className={classes.scenarioStepIcon} />,
    skipped: <CheckBoxOutlineBlank className={classes.scenarioStepIcon} />,
  };

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(step => {
          const status = step.manualStatus ? step.manualStatus : step.status;

          return (
            <ListItem
              button
              key={step.id}
              className={classes.step}
              onClick={getNextHandler(step, handleStatusChange)}
              onMouseEnter={() => handleMouseEnterStep(step.id)}
              onMouseLeave={() => handleMouseLeaveStep(step.id)}
            >
              <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
                <Grid item>{iconMap[status]}</Grid>
                <Grid item>
                  <span className={classes.stepKeyword}>{step.keyword}</span>
                  <span>{step.name}</span>
                </Grid>
                <Grid item>
                  {step.id === hoveredStepId ? renderMoreButton(step, anchor, handleMoreButtonClicked, handleStatusChange, classes) : null}
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);
