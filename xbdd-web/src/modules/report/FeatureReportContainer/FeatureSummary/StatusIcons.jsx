import React from "react";
import PropTypes from "prop-types";
import { Forward } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";
import { statusIconStyles } from "./styles/FeatureSummaryStyles";

const StatusIcons = props => {
  const { firstStatus, secondStatus, isSmall, classes } = props;
  var sizeClasses = classes.bigIcons;
  if (isSmall) {
    sizeClasses = classes.smallIcons;
  }

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={`${classes.xbddFeaturePassed} ${sizeClasses}`} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={`${classes.xbddFeatureFailed} ${sizeClasses}`} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={`${classes.xbddFeatureUndefined} ${sizeClasses}`} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={`${classes.xbddFeatureSkipped} ${sizeClasses}`} />,
  };

  return (
    <div className={classes.xbddFeatureStatus}>
      {iconMap[firstStatus]}
      <Forward className={`${classes.xbddFeatureStatusArrow} ${sizeClasses}`} />
      {iconMap[secondStatus]}
    </div>
  );
};

StatusIcons.propTypes = {
  originalAutomatedStatus: PropTypes.string,
  calculatedStatus: PropTypes.string,
  classes: PropTypes.shape({}),
};

export default withStyles(statusIconStyles)(StatusIcons);
