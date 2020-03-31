import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { tagListStyles } from './styles/TagListStyles';
import TagListItem from './TagListItem';
import Tag from 'models/Tag';
import Status from 'models/Status';
import TagAssignments from 'models/TagAssignments';
import { useSelector } from 'react-redux';
import { RootStore } from 'rootReducer';
import { UserName } from 'models/User';

interface Props extends WithStyles {
  loggedInUserName: UserName;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  tagAssignments: TagAssignments;
  restId: string;
  selectedFeatureId: string;
  selectedStatus: Status;
  handleFeatureSelected(): void;
  handleTagAssigned(): void;
  handleTagIgnore(): void;
}

const TagList: FC<Props> = ({
  loggedInUserName,
  isEditMode,
  isAssignedTagsView,
  tagList,
  tagAssignments,
  restId,
  selectedFeatureId,
  selectedStatus,
  handleFeatureSelected,
  handleTagAssigned,
  handleTagIgnore,
  classes,
}) => {
  const tagsIgnored = useSelector((state: RootStore) => state.tagsIgnored);
  return (
    <Card raised className={classes.tagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            loggedInUserName={loggedInUserName}
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
            tag={tag}
            tagAssignments={tagAssignments}
            tagsIgnored={tagsIgnored}
            key={tag.name}
            restId={restId}
            selectedFeatureId={selectedFeatureId}
            selectedStatus={selectedStatus}
            handleFeatureSelected={handleFeatureSelected}
            handleTagAssigned={handleTagAssigned}
            handleTagIgnore={handleTagIgnore}
          />
        ))}
      </List>
    </Card>
  );
};

export default withStyles(tagListStyles)(TagList);
