import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem, Card } from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/Forward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/styles";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";

const renderTags = (tags, classes) => <span className={classes}>{tags.map(tag => tag.name)}</span>;

const ListViewFeatureList = props => {
  const { featureList, selectedStatus, handleFeatureSelected, classes } = props;
  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

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
    <Card>
      <List>
        {filterFeatureList.map(feature => (
          <ListItem button key={feature.id} className={classes.xbddFeatureListItem} onClick={() => handleFeatureSelected(feature)}>
            {renderFeatureStatus(feature)}
            <span className={classesMap[feature.calculatedStatus]}>{" " + feature.name + " "}</span>
            {feature.tags ? renderTags(feature.tags, classes.tags) : null}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

ListViewFeatureList.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(featureListItemStyles)(ListViewFeatureList);
