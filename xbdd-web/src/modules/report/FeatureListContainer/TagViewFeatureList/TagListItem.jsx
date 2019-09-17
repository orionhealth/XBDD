import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import TagViewFeatureList from "./TagViewFeatureList";
import Tag from "../../../../models/Tag";
import { tagListItemStyles } from "./styles/TagListStyles";

const TagListItem = props => {
  const { tag, selectedFeatureId, isSelected, selectedStatus, handleTagSelect, handleFeatureSelected, classes } = props;
  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  let className = classes.xbddTagListItemContainer;

  if (isSelected) {
    className += ` ${classes.xbddTagListItemContainerExpanded}`;
  }
  const onClick = () => handleTagSelect(tag.name);

  return (
    <>
      <ListItem button divider onClick={onClick} className={className}>
        <ListItemIcon className={classes.listItemIcon}>
          <FontAwesomeIcon icon={faTag} />
        </ListItemIcon>
        <ListItemText>{tag.name}</ListItemText>
        {isSelected ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <TagViewFeatureList selectedFeatureId={selectedFeatureId} featureList={featureList} handleFeatureSelected={handleFeatureSelected} />
      </Collapse>
    </>
  );
};

TagListItem.propTypes = {
  tag: PropTypes.instanceOf(Tag).isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListItemStyles)(TagListItem);
