import React from "react";
import { List, ListItem, Popper, IconButton, Fade, Card, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { stepStyles } from "./styles/ScenarioListStyles";
import { MoreHoriz } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

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

const renderMoreButton = (
  scenarioId,
  step,
  anchor,
  handleMoreButtonHovered,
  handleMoreButtonNotHovered,
  handleStatusChange,
  clickEventWrapper,
  classes
) => (
  <span onMouseEnter={e => handleMoreButtonHovered(e)} onMouseLeave={() => handleMoreButtonNotHovered()}>
    <IconButton className={classes.moreButton}>
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
  </span>
);

const renderTable = (rows, classes) => {
  var index = 0;
  return (
    <div className={classes.stepTable}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {rows[0].cells.map(cell => (
              <TableCell key={cell}>{cell}</TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(1).map(row => (
            <TableRow key={row.line}>
              {row.cells.map(cell => (
                <TableCell key={index++}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const renderScreenshot = (embeddings, classes) => (
  <div className={classes.screenshot}>
    <img src={`/rest/attachment/${embeddings}`} alt={"Screenshot Not Found"} />
  </div>
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
    handleMoreButtonNotHovered,
    handleStatusChange,
    classes,
  } = props;

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckSquare} className={`${classes.scenarioStepStatusPassed} ${classes.scenarioStepIcon}`} />,
    failed: <FontAwesomeIcon icon={faMinusSquare} className={`${classes.scenarioStepStatusFailed} ${classes.scenarioStepIcon}`} />,
    undefined: <FontAwesomeIcon icon={faSquare} className={classes.scenarioStepIcon} />,
    skipped: <FontAwesomeIcon icon={faSquare} className={classes.scenarioStepIcon} />,
  };

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(step => {
          var stepIconClasses = classes.stepIconBox;
          const status = step.manualStatus ? step.manualStatus : step.status;
          if (status === "failed") {
            stepIconClasses += ` ${classes.stepIconFailed}`;
          }
          return (
            <ListItem
              button
              key={step.id}
              className={classes.step}
              onClick={e => clickEventWrapper(e, scenarioId, step, null, handleStatusChange)}
              onMouseEnter={() => handleStepHovered(step.id)}
              onMouseLeave={() => handleStepNotHovered(step.id)}
            >
              <Box display="flex" flexDirection="row">
                <Box p={1} className={stepIconClasses}>
                  {iconMap[status]}
                </Box>
                <Box p={1} className={classes.stepContentBox}>
                  <div>
                    <span className={classes.stepKeyword}>{step.keyword}</span>
                    <span>{`${step.name} `}</span>
                    {step.id === hoveredStepId
                      ? renderMoreButton(
                          scenarioId,
                          step,
                          anchor,
                          handleMoreButtonHovered,
                          handleMoreButtonNotHovered,
                          handleStatusChange,
                          clickEventWrapper,
                          classes
                        )
                      : null}
                  </div>
                  {step.rows ? renderTable(step.rows, classes) : null}
                  {step.embeddings ? renderScreenshot(step.embeddings, classes) : null}
                </Box>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);
