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

const renderList = (className, tagList, selectedStatus, expandedTagsList, handleTagSelect) => {
  if (!tagList.length) {
    return null;
  }
  return (
    <Card raised className={className}>
      <List component="ul">
        {tagList.map(tag => mapTagToTagListItem(tag, expandedTagsList.includes(tag.name), selectedStatus, handleTagSelect))}
      </List>
    </Card>
  );
};

const TagListView = props => {
  const { tagList, selectedStatus, expandedTagsList, handleFilterButtonClick, handleTagSelect, classes } = props;

  return (
    <div className={classes.xbddTagListContainer}>
      <TagListFilterButtonsView selectedStatus={selectedStatus} handleFilterButtonClick={handleFilterButtonClick} />
      {renderList(classes.xbddTagList, tagList, selectedStatus, expandedTagsList, handleTagSelect)}
    </div>
  );
};

TagListView.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  expandedTagsList: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  expandedTagsList: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagListView);
