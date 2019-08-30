import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Tag from "../../../models/Tag";
import TagListItemView from "./widgets/TagListItemView";
import TagListFilterButtonsView from "./widgets/TagListFilterButtonsView";
import { tagListStyles } from "./styles/TagListStyles";
import { Card } from "@material-ui/core";

const mapTagToTagListItem = (tag, itemsUIState, filterStates, onSelectTag) => (
  <TagListItemView tag={tag} key={tag.name} itemsUIState={itemsUIState} filterStates={filterStates} onSelectTag={onSelectTag} />
);

const renderList = (className, tags, itemsUIState, filterStates, onSelectTag) => {
  if (!tags.length) {
    return null;
  }
  return (
    <Card raised className={className}>
      <List component="ul">{tags.map(tag => mapTagToTagListItem(tag, itemsUIState[tag.name], filterStates, onSelectTag))}</List>
    </Card>
  );
};

const TagListView = props => (
  <div className={props.classes.xbddTagListContainer}>
    <TagListFilterButtonsView filterStates={props.filterStates} onFilterButtonClick={props.onFilterButtonClick} />
    {renderList(props.classes.xbddTagList, props.tags, props.itemsUIState, props.filterStates, props.onSelectTag)}
  </div>
);

TagListView.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  filterStates: PropTypes.shape({}).isRequired,
  onSelectTag: PropTypes.func,
  onFilterButtonClick: PropTypes.func,
  classes: PropTypes.shape({
    xbddTagListContainer: PropTypes.string,
    xbddTagList: PropTypes.string,
  }).isRequired,
};

TagListView.defaultProps = {
  tags: [],
  selectedTag: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagListView);
