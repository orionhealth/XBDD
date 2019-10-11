import React from "react";
import { PropTypes } from "prop-types";
import { Card, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { tagListStyles } from "./styles/TagListStyles";
import TagListItem from "./TagListItem";
import Tag from "../../../../models/Tag";

const TagList = props => {
  const {
    userName,
    tagList,
    restId,
    selectedFeatureId,
    selectedStatus,
    expandedTagsList,
    handleTagSelect,
    handleFeatureSelected,
    handleTagAssigned,
    handleWarningShow,
    classes,
  } = props;

  return (
    <Card raised className={classes.xbddTagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            userName={userName}
            tag={tag}
            key={tag.name}
            restId={restId}
            isSelected={expandedTagsList.includes(tag.name)}
            selectedFeatureId={selectedFeatureId}
            selectedStatus={selectedStatus}
            handleTagSelect={handleTagSelect}
            handleFeatureSelected={handleFeatureSelected}
            handleTagAssigned={handleTagAssigned}
            handleWarningShow={handleWarningShow}
          />
        ))}
      </List>
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
