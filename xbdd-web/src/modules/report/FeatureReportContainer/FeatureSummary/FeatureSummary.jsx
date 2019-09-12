import React from "react";
import { Card, Grid, Typography, Chip, Divider } from "@material-ui/core";
import { Forward } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";
import { featureSummaryStyles } from "./styles/FeatureSummaryStyles";
import ExecutionHistory from "./ExecutionHistory";

const renderTags = (tags, classes) => tags.map(tag => <Chip key={tag.name} label={tag.name} size="small" className={classes} />);

const renderLastEdit = classes => (
  <div className={classes}>
    <div>Last edited by: Feier</div>
    <div>3 minutes ago</div>
  </div>
);

const FeatureSummary = props => {
  const { feature, executionHistory, classes } = props;

  const classesMap = {
    passed: classes.xbddFeaturePassed,
    failed: classes.xbddFeatureFailed,
    undefined: classes.xbddFeatureUndefined,
    skipped: classes.xbddFeatureSkipped,
  };

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={`${classesMap["passed"]} ${classes.xbddFeatureIcons}`} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={`${classesMap["failed"]} ${classes.xbddFeatureIcons}`} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={`${classesMap["undefined"]} ${classes.xbddFeatureIcons}`} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={`${classesMap["skipped"]} ${classes.xbddFeatureIcons}`} />,
  };

  const renderFeatureStatus = feature => (
    <div className={classes.xbddFeatureStatus}>
      {iconMap[feature.originalAutomatedStatus]}
      <Forward className={classes.xbddFeatureStatusArrow} />
      {iconMap[feature.calculatedStatus]}
    </div>
  );

  return (
    <Card raised className={classes.featureSummary}>
      <Grid container>
        <Grid item xs={2}>
          {renderFeatureStatus(feature)}
          {renderLastEdit(classes.featureEditInfo)}
          {feature.tags ? <div className={classes.featureTags}>{renderTags(feature.tags, classes.featureTag)}</div> : null}
        </Grid>
        <Grid item xs={10}>
          <Grid item xs={10}>
            <Typography variant="h6" className={`${classesMap[feature.calculatedStatus]} ${classes.featureTitle}`}>
              {feature.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography display="block" className={classes.featureDescription}>
              {feature.description}
            </Typography>
          </Grid>
          <Divider />
          <Grid item xs={10}>
            {executionHistory ? <ExecutionHistory executionHistory={executionHistory} /> : null}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default withStyles(featureSummaryStyles)(FeatureSummary);
