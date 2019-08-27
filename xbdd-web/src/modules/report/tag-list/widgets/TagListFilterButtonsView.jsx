import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import BlockIcon from "@material-ui/icons/Block";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { tagListFilterButtonStyles } from "../styles/TagListStyles";
import { Card } from "@material-ui/core";

const createButton = variant => (
  <Tooltip title={variant.tooltip} placement="top">
    <IconButton className={`${variant.colorClass} ${variant.buttonClass}`} onClick={variant.handler} variant="outlined">
      {variant.icon}
    </IconButton>
  </Tooltip>
);

const TagListFilterButtonsView = props => {
  const { classes, filterStates, onFilterButtonClick } = props;
  const variants = {
    passed: {
      icon: <DoneIcon />,
      tooltip: "Passed",
      colorClass: filterStates.passedSelected ? classes.xbddFilterButtonPassed : classes.xbddFilterButtonUnselected,
      handler: () => onFilterButtonClick("passedSelected"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    failed: {
      icon: <ErrorOutlineIcon />,
      tooltip: "Failed",
      colorClass: filterStates.failedSelected ? classes.xbddFilterButtonFailed : classes.xbddFilterButtonUnselected,
      handler: () => onFilterButtonClick("failedSelected"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    undefined: {
      icon: <HelpOutlineIcon />,
      tooltip: "Undefined",
      colorClass: filterStates.undefinedSelected ? classes.xbddFilterButtonUndefined : classes.xbddFilterButtonUnselected,
      handler: () => onFilterButtonClick("undefinedSelected"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    skipped: {
      icon: <BlockIcon />,
      tooltip: "Skipped",
      colorClass: filterStates.skippedSelected ? classes.xbddFilterButtonSkipped : classes.xbddFilterButtonUnselected,
      handler: () => onFilterButtonClick("skippedSelected"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
  };

  return (
    <Card raised className={classes.xbddTagListFilterButtons}>
      {createButton(variants.passed)}
      {createButton(variants.failed)}
      {createButton(variants.undefined)}
      {createButton(variants.skipped)}
    </Card>
  );
};

TagListFilterButtonsView.propTypes = {
  filterStates: PropTypes.shape({}).isRequired,
  onFilterButtonClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListFilterButtonStyles)(TagListFilterButtonsView);
