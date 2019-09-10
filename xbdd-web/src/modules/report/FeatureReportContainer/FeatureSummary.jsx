import React from "react";
import { Card, Typography } from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/Forward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";
import { featureSummaryStyles } from "./styles/FeatureReportContainerStyles";

const FeatureSummary = props => {
  const { feature, classes } = props;

  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={classesMap["passed"] + " " + classes.xbddFeatureListIcons} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={classesMap["failed"] + " " + classes.xbddFeatureListIcons} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={classesMap["undefined"] + " " + classes.xbddFeatureListIcons} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={classesMap["skipped"] + " " + classes.xbddFeatureListIcons} />,
  };

  const renderFeatureStatus = feature => (
    <span className={classes.xbddFeatureStatus}>
      {iconMap[feature.originalAutomatedStatus]}
      <ForwardIcon className={classes.xbddFeatureListItemArrow} />
      {iconMap[feature.calculatedStatus]}
    </span>
  );

  return (
    <Card className={classes.featureSummary}>
      <Typography>
        {renderFeatureStatus(feature)}
        {feature.name}
      </Typography>
      <Typography>Description: {feature.description}</Typography>
      <Typography>Tags: {feature.tags ? feature.tags.forEach(tag => tag.name) : null}</Typography>
    </Card>
  );
};

export default withStyles(featureSummaryStyles)(FeatureSummary);
