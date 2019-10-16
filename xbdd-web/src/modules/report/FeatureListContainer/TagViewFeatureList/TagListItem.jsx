import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Collapse, Avatar } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import Tag from "../../../../models/Tag";
import { tagListItemStyles } from "./styles/TagListStyles";
import TagViewFeatureList from "./TagViewFeatureList";

const clickEventWrapper = (event, restId, tagName, tagUserName, currentUserName, handleWarningShow, handleTagAssigned, handleTagSelect) => {
  event.stopPropagation();
  let node = event.target;

  while (node) {
    if (typeof node.className === "string" && node.className.indexOf("MuiAvatar-root") !== -1) {
      if (tagUserName && tagUserName !== currentUserName) {
        handleWarningShow(restId, tagName, tagUserName, currentUserName);
        return;
      }
      handleTagAssigned(restId, tagName, tagUserName, currentUserName);
      return;
    }
    node = node.parentNode;
  }
  handleTagSelect(tagName);
};

const renderAvatar = (restId, tagName, tagUserName, currentUserName, handleWarningShow, handleTagAssigned, classes) => {
  const color = tagUserName ? getHSLFromString(tagUserName) : "";

  return (
    <Avatar
      className={classes}
      style={{ backgroundColor: color }}
      onClick={e => clickEventWrapper(e, restId, tagName, tagUserName, currentUserName, handleWarningShow, handleTagAssigned)}
    >
      {tagUserName ? tagUserName : "?"}
    </Avatar>
  );
};

const getHSLFromString = string => {
  var val = 0;
  for (let i = 0; i < string.length; i++) {
    val += string.charCodeAt(i);
  }
  return "hsl(" + ((val * val) % 360) + ", 21%, 63%)";
};

const TagListItem = props => {
  const {
    userName,
    tag,
    selectedFeatureId,
    restId,
    isSelected,
    selectedStatus,
    handleTagSelect,
    handleFeatureSelected,
    handleTagAssigned,
    handleWarningShow,
    classes,
  } = props;
  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  let className = classes.xbddTagListItemContainer;

  if (isSelected) {
    className += ` ${classes.xbddTagListItemContainerExpanded}`;
  }

  return (
    <>
      <ListItem
        button
        divider
        onClick={e => clickEventWrapper(e, null, tag.name, null, null, null, null, handleTagSelect)}
        className={className}
      >
        <ListItemIcon className={classes.listItemIcon}>
          <FontAwesomeIcon icon={faTag} />
        </ListItemIcon>
        <ListItemText>{tag.name}</ListItemText>
        {renderAvatar(restId, tag.name, tag.userName, userName, handleWarningShow, handleTagAssigned, classes.userAvatar)}
        {isSelected ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <TagViewFeatureList selectedFeatureId={selectedFeatureId} featureList={featureList} handleFeatureSelected={handleFeatureSelected} />
      </Collapse>
    </>
  );
};

TagListItem.propTypes = {
  userName: PropTypes.string,
  tag: PropTypes.instanceOf(Tag).isRequired,
  selectedFeatureId: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  handleTagAssigned: PropTypes.func.isRequired,
  handleWarningShow: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListItemStyles)(TagListItem);
