import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import BlockIcon from "@material-ui/icons/Block";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { filterButtonStyles } from "./styles/FeatureListContainerStyles";
import { Card } from "@material-ui/core";

const createButton = variant => (
  <Tooltip title={variant.tooltip} placement="top">
    <IconButton className={`${variant.colorClass} ${variant.buttonClass}`} onClick={variant.handler} variant="outlined">
      {variant.icon}
    </IconButton>
  </Tooltip>
);

const FeatureFilterButtons = props => {
  const { selectedStatus, handleFilterButtonClick, classes } = props;
  const variants = {
    passed: {
      icon: <DoneIcon />,
      tooltip: "Passed",
      colorClass: selectedStatus.passed ? classes.xbddFilterButtonPassed : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick("passed"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    failed: {
      icon: <ErrorOutlineIcon />,
      tooltip: "Failed",
      colorClass: selectedStatus.failed ? classes.xbddFilterButtonFailed : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick("failed"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    undefined: {
      icon: <HelpOutlineIcon />,
      tooltip: "Undefined",
      colorClass: selectedStatus.undefined ? classes.xbddFilterButtonUndefined : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick("undefined"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    skipped: {
      icon: <BlockIcon />,
      tooltip: "Skipped",
      colorClass: selectedStatus.skipped ? classes.xbddFilterButtonSkipped : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick("skipped"),
      buttonClass: `${classes.xbddFilterButton}`,
    },
  };

  return (
    <div className={classes.xbddFilterButtons}>
      <Card raised>
        {createButton(variants.passed)}
        {createButton(variants.failed)}
        {createButton(variants.undefined)}
        {createButton(variants.skipped)}
      </Card>
    </div>
  );
};

FeatureFilterButtons.propTypes = {
  selectedStatus: PropTypes.shape({}).isRequired,
  handleFilterButtonClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(filterButtonStyles)(FeatureFilterButtons);
