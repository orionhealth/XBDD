import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Tag from "../../../models/Tag";
import TagListItemView from "./widgets/TagListItemView";
import TagListFilterButtonsView from "./widgets/TagListFilterButtonsView";
import { tagListStyles } from "./styles/TagListStyles";
import { Card } from "@material-ui/core";

const mapTagToTagListItem = (tag, isSelected, selectedStatus, handleTagSelect) => (
  <TagListItemView tag={tag} key={tag.name} isSelected={isSelected} selectedStatus={selectedStatus} handleTagSelect={handleTagSelect} />
);

const renderList = (className, tagList, selectedTags, selectedStatus, handleTagSelect) => {
  if (!tagList.length) {
    return null;
  }
  return (
    <Card raised className={className}>
      <List component="ul">{tagList.map(tag => mapTagToTagListItem(tag, selectedTags[tag.name], selectedStatus, handleTagSelect))}</List>
    </Card>
  );
};

const TagListView = props => (
  <div className={props.classes.xbddTagListContainer}>
    <TagListFilterButtonsView selectedStatus={props.selectedStatus} handleFilterButtonClick={props.handleFilterButtonClick} />
    {renderList(props.classes.xbddTagList, props.tagList, props.selectedTags, props.selectedStatus, props.handleTagSelect)}
  </div>
);

TagListView.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  selectedTags: PropTypes.shape({}).isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleFilterButtonClick: PropTypes.func,
  handleTagSelect: PropTypes.func,
  classes: PropTypes.shape({
    xbddTagListContainer: PropTypes.string,
    xbddTagList: PropTypes.string,
  }).isRequired,
};

TagListView.defaultProps = {
  tagList: [],
  selectedStatus: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagListView);
