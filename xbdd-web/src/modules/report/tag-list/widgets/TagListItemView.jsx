import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import { TurnedIn, ExpandLess, ExpandMore } from "@material-ui/icons";
import TagListFeaturesListView from "./TagListFeaturesListView";
import Tag from "../../../../models/Tag";
import { tagListItemStyles } from "../styles/TagListStyles";

const filterFeaturesByTag = (features, filterStates) => {
  const filterMap = {
    passed: filterStates.passedSelected,
    failed: filterStates.passedSelected,
    undefined: filterStates.undefinedSelected,
    skipped: filterStates.skippedSelected,
  };
  return features.filter(feature => filterMap[feature.calculatedStatus]);
};

const TagListItemView = props => {
  const { tag, classes, itemsUIState, filterStates, onSelectTag } = props;
  const features = filterFeaturesByTag(tag.features, filterStates);
  let className = classes.xbddTagListItemContainer;

  if (itemsUIState.expanded) {
    className += ` ${classes.xbddTagListItemContainerExpanded}`;
  }
  const onClick = () => onSelectTag(props.tag);

  return (
    <>
      <ListItem button divider onClick={onClick} className={className}>
        <ListItemIcon style={{ minWidth: "36px" }}>
          <TurnedIn />
        </ListItemIcon>
        <ListItemText>{tag.name}</ListItemText>
        {itemsUIState.expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={itemsUIState.expanded} timeout="auto" unmountOnExit>
        <TagListFeaturesListView features={features} />
      </Collapse>
    </>
  );
};

TagListItemView.propTypes = {
  tag: PropTypes.instanceOf(Tag).isRequired,
  classes: PropTypes.shape({}).isRequired,
  onSelectTag: PropTypes.func.isRequired,
};

export default withStyles(tagListItemStyles)(TagListItemView);
