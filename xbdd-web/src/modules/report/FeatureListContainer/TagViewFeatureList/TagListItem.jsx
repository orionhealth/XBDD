import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Collapse, Avatar } from "@material-ui/core";
import { Block, ExpandLess, ExpandMore } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import Tag from "../../../../models/Tag";
import { tagListItemStyles } from "./styles/TagListStyles";
import TagViewFeatureList from "./TagViewFeatureList";

const clickEventWrapper = (
  event,
  restId,
  tagName,
  tagUserName,
  currentUserName,
  handleWarningShow,
  handleTagAssigned,
  handleTagSelect,
  handleTagIgnore
) => {
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
    if (node.className && node.className.baseVal && node.className.baseVal.indexOf("TagListItem-checkboxIcons") !== -1) {
      const product = restId.split("/")[0];
      handleTagIgnore(product, tagName);
      return;
    }
    node = node.parentNode;
  }
  handleTagSelect(tagName);
};

const renderAvatar = (restId, tag, currentUserName, handleWarningShow, handleTagAssigned, classes) => {
  const tagUserName = tag.userName;
  const color = tagUserName ? getHSLFromString(tagUserName) : null;

  if (tag.isIgnored) {
    return <Block className={classes.blockAvatar} />;
  }
  return (
    <Avatar
      className={classes.userAvatar}
      style={{ backgroundColor: color }}
      onClick={e => clickEventWrapper(e, restId, tag.name, tagUserName, currentUserName, handleWarningShow, handleTagAssigned)}
    >
      {tagUserName ? tagUserName : "?"}
    </Avatar>
  );
};

const renderCheckbox = (tag, restId, handleTagIgnore, classes) => {
  let iconClasses = classes.checkboxIcons;
  if (tag.isIgnored) {
    iconClasses += ` ${classes.ignoredColor}`;
  }

  return (
    <FontAwesomeIcon
      icon={tag.isIgnored ? faMinusSquare : faSquare}
      className={iconClasses}
      onClick={e => clickEventWrapper(e, restId, tag.name, null, null, null, null, null, handleTagIgnore)}
    />
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
    isEditMode,
    isAssignedTagsView,
    tag,
    selectedFeatureId,
    restId,
    isSelected,
    selectedStatus,
    handleTagSelect,
    handleFeatureSelected,
    handleTagAssigned,
    handleWarningShow,
    handleTagIgnore,
    classes,
  } = props;
  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  let className = classes.xbddTagListItemContainer;

  if (isSelected) {
    className += ` ${classes.xbddTagListItemContainerExpanded}`;
  }

  return isAssignedTagsView && tag.isIgnored ? null : (
    <>
      <ListItem
        button
        divider
        onClick={e => clickEventWrapper(e, null, tag.name, null, null, null, null, handleTagSelect)}
        className={className}
      >
        {isEditMode ? renderCheckbox(tag, restId, handleTagIgnore, classes) : null}
        <ListItemIcon className={classes.listItemIcon}>
          <span className={tag.isIgnored ? classes.ignoredColor : null}>
            <FontAwesomeIcon icon={faTag} />
          </span>
        </ListItemIcon>
        <ListItemText className={tag.isIgnored ? classes.ignoredColor : null}>{tag.name}</ListItemText>
        {renderAvatar(restId, tag, userName, handleWarningShow, handleTagAssigned, classes)}
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
  isEditMode: PropTypes.bool,
  isAssignedTagsView: PropTypes.bool,
  tag: PropTypes.instanceOf(Tag).isRequired,
  selectedFeatureId: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  handleTagAssigned: PropTypes.func.isRequired,
  handleWarningShow: PropTypes.func.isRequired,
  handleTagIgnore: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListItemStyles)(TagListItem);
