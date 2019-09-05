import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import { TurnedIn, ExpandLess, ExpandMore } from "@material-ui/icons";
import TagListFeaturesListView from "./TagListFeaturesListView";
import Tag from "../../../../models/Tag";
import { tagListItemStyles } from "../styles/TagListStyles";

const TagListItemView = props => {
  const { tag, isSelected, selectedStatus, handleTagSelect, classes } = props;
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
          <TurnedIn />
        </ListItemIcon>
        <ListItemText>{tag.name}</ListItemText>
        {isSelected ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <TagListFeaturesListView featureList={featureList} />
      </Collapse>
    </>
  );
};

TagListItemView.propTypes = {
  tag: PropTypes.instanceOf(Tag).isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListItemStyles)(TagListItemView);
