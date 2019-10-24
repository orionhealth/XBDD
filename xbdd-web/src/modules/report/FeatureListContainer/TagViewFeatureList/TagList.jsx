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
    isEditMode,
    isAssignedTagsView,
    tagList,
    restId,
    selectedFeatureId,
    selectedStatus,
    expandedTagsList,
    handleTagSelect,
    handleFeatureSelected,
    handleTagAssigned,
    handleWarningShow,
    handleTagIgnore,
    classes,
  } = props;

  return (
    <Card raised className={classes.xbddTagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            userName={userName}
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
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
            handleTagIgnore={handleTagIgnore}
          />
        ))}
      </List>
    </Card>
  );
};

TagList.propTypes = {
  userName: PropTypes.string,
  isEditMode: PropTypes.bool,
  isAssignedTagsView: PropTypes.bool,
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  restId: PropTypes.string,
  expandedTagsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFeatureId: PropTypes.string,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleTagSelect: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  handleTagAssigned: PropTypes.func,
  handleWarningShow: PropTypes.func,
  handleTagIgnore: PropTypes.func,
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
