import React from "react";
import PropTypes from "prop-types";
import { IconButton, Popper, Fade, Card, List, ListItem } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { popperMenuStyles } from "./styles/ScenarioStepStyles";

const PopperMenu = props => {
  const {
    scenarioId,
    stepId,
    anchor,
    handleMoreButtonHovered,
    handleMoreButtonNotHovered,
    handleStatusChange,
    clickEventWrapper,
    classes,
  } = props;

  return (
    <span onMouseEnter={e => handleMoreButtonHovered(e)} onMouseLeave={() => handleMoreButtonNotHovered()}>
      <IconButton className={classes.moreButton}>
        <MoreHoriz className={classes.scenarioStepIcon} />
      </IconButton>
      <Popper open={!!anchor} anchorEl={anchor} transition className={classes.popperMenu}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card>
              <List>
                <ListItem button onClick={e => clickEventWrapper(e, scenarioId, stepId, "passed", handleStatusChange)}>
                  Pass
                </ListItem>
                <ListItem button onClick={e => clickEventWrapper(e, scenarioId, stepId, "failed", handleStatusChange)}>
                  Fail
                </ListItem>
                <ListItem button onClick={e => clickEventWrapper(e, scenarioId, stepId, "skipped", handleStatusChange)}>
                  Skip
                </ListItem>
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
    </span>
  );
};

PopperMenu.propTypes = {
  scenarioId: PropTypes.string,
  stepId: PropTypes.number,
  anchor: PropTypes.object,
  handleMoreButtonHovered: PropTypes.func.isRequired,
  handleMoreButtonNotHovered: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  clickEventWrapper: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(popperMenuStyles)(PopperMenu);
