import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { tagListStyles } from './styles/TagListStyles';
import TagListItem from './TagListItem';
import Tag from 'models/Tag';
import { StatusMap } from 'models/Status';
import TagAssignments from 'models/TagAssignments';
import { RootStore } from 'rootReducer';
import { User } from 'models/User';

interface Props extends WithStyles {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  tagAssignments: TagAssignments;
  restId: string;
  selectedFeatureId: string;
  selectedStatus: StatusMap<boolean>;
  handleFeatureSelected(): void;
  handleTagAssigned(restId: string, tag: string, currentlyAssignedUser: User): void;
  handleTagIgnore(product: string, tagName: string): void;
}

const TagList: FC<Props> = ({
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
