import React from "react";
import { PropTypes } from "prop-types";
import { Card, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { tagListStyles } from "./styles/TagListStyles";
import TagListItem from "./TagListItem";
import Tag from "../../../../models/Tag";

const renderListItem = (tagList, selectedStatus, expandedTagsList, handleTagSelect, handleFeatureSelected) =>
  tagList.map(tag => (
    <TagListItem
      tag={tag}
      key={tag.name}
      isSelected={expandedTagsList.includes(tag.name)}
      selectedStatus={selectedStatus}
      handleTagSelect={handleTagSelect}
      handleFeatureSelected={handleFeatureSelected}
    />
  ));

const TagList = props => {
  const { tagList, selectedStatus, expandedTagsList, handleTagSelect, handleFeatureSelected, classes } = props;

  return (
    <Card raised className={classes.xbddTagList}>
      <List component="ul">{renderListItem(tagList, selectedStatus, expandedTagsList, handleTagSelect, handleFeatureSelected)}</List>
    </Card>
  );
};

TagList.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  expandedTagsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    xbddTagListContainer: PropTypes.string,
    xbddTagList: PropTypes.string,
  }).isRequired,
};

TagList.defaultProps = {
  tagList: [],
  expandedTagsList: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagList);
