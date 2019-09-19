import React from "react";
import { List, ListItem, Grid, Popper, IconButton, Fade, Card } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { stepStyles } from "./styles/ScenarioListStyles";
import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox, MoreHoriz } from "@material-ui/icons";

const clickEventWrapper = (event, scenarioId, step, status, handleStatusChange) => {
  let node = event.target;

  const handlerMap = {
    passed: () => handleStatusChange(scenarioId, step.id, "failed"),
    failed: () => handleStatusChange(scenarioId, step.id, "skipped"),
    undefined: () => handleStatusChange(scenarioId, step.id, "passed"),
    skipped: () => handleStatusChange(scenarioId, step.id, "passed"),
  };

  while (node) {
    if (node.className === "MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button") {
      if (status) {
        handleStatusChange(scenarioId, step.id, status);
      }
      return;
    }
    node = node.parentNode;
  }
  if (step.manualStatus) {
    handlerMap[step.manualStatus]();
  } else {
    handlerMap[step.status]();
  }
};

const renderMoreButton = (scenarioId, step, anchor, handleMoreButtonHovered, handleStatusChange, clickEventWrapper, classes) => (
  <>
    <IconButton className={classes.moreButton} onMouseEnter={e => handleMoreButtonHovered(e)}>
      <MoreHoriz className={classes.scenarioStepIcon} />
    </IconButton>
    <Popper open={!!anchor} anchorEl={anchor} transition className={classes.popperMenu}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Card>
            <List>
              <ListItem button onClick={e => clickEventWrapper(e, scenarioId, step, "passed", handleStatusChange)}>
                Pass
              </ListItem>
              <ListItem button onClick={e => clickEventWrapper(e, scenarioId, step, "failed", handleStatusChange)}>
                Fail
              </ListItem>
              <ListItem button onClick={e => clickEventWrapper(e, scenarioId, step, "skipped", handleStatusChange)}>
                Skip
              </ListItem>
            </List>
          </Card>
        </Fade>
      )}
    </Popper>
  </>
);

const ScenarioStep = props => {
  const {
    title,
    scenarioId,
    steps,
    hoveredStepId,
    anchor,
    handleStepHovered,
    handleStepNotHovered,
    handleMoreButtonHovered,
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
              onClick={e => clickEventWrapper(e, scenarioId, step, null, handleStatusChange)}
              onMouseEnter={() => handleStepHovered(step.id)}
              onMouseLeave={() => handleStepNotHovered(step.id)}
            >
              <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
                <Grid item>{iconMap[status]}</Grid>
                <Grid item>
                  <span className={classes.stepKeyword}>{step.keyword}</span>
                  <span>{step.name}</span>
                </Grid>
                <Grid item>
                  {step.id === hoveredStepId
                    ? renderMoreButton(scenarioId, step, anchor, handleMoreButtonHovered, handleStatusChange, clickEventWrapper, classes)
                    : null}
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
