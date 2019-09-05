import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Tag from "../../../../models/Tag";
import TagViewFeatureListItem from "./TagViewFeatureListItem";
import { tagListStyles } from "./styles/TagListStyles";
import { Card } from "@material-ui/core";

const renderListItem = (tagList, selectedStatus, expandedTagsList, handleTagSelect) =>
  tagList.map(tag => (
    <TagViewFeatureListItem
      tag={tag}
      key={tag.name}
      isSelected={expandedTagsList.includes(tag.name)}
      selectedStatus={selectedStatus}
      handleTagSelect={handleTagSelect}
    />
  ));

const TagViewFeatureList = props => {
  const { tagList, selectedStatus, expandedTagsList, handleTagSelect, classes } = props;

  return (
    <Card raised className={classes.xbddTagList}>
      <List component="ul">{renderListItem(tagList, selectedStatus, expandedTagsList, handleTagSelect)}</List>
    </Card>
  );
};

TagViewFeatureList.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  expandedTagsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func,
  classes: PropTypes.shape({
    xbddTagListContainer: PropTypes.string,
    xbddTagList: PropTypes.string,
  }).isRequired,
};

TagViewFeatureList.defaultProps = {
  tagList: [],
  expandedTagsList: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagViewFeatureList);
