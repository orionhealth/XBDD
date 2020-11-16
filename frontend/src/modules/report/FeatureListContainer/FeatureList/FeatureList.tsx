import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { StatusMap } from 'models/Status';
import { User } from 'models/User';
import { RootStore } from 'rootReducer';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';

interface Props {
  user: User;
  isEditMode: boolean;
  isTagView: boolean;
  isAssignedTagsView: boolean;
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const FeatureList: FC<Props> = props => {
  const idIndex = useSelector((state: RootStore) => state.feature.byId);
  const tagIndex = useSelector((state: RootStore) => state.feature.byTag);
  const tagAssignments = useSelector((state: RootStore) => state.tags.assignments);

  if (!(idIndex && tagIndex && tagAssignments)) {
    return null;
  }

  const { user, isEditMode, isTagView, isAssignedTagsView, selectedFeatureId, selectedStatus } = props;

  if (isTagView) {
    let filteredTagList = tagIndex || [];
    if (isAssignedTagsView) {
      filteredTagList = filteredTagList.filter(tag => tagAssignments[tag.name]?.userId === user.userId);
    }
    filteredTagList = filteredTagList.filter(tag => tag.features.find(feature => selectedStatus[feature.calculatedStatus]));
    return (
      <TagList
        isEditMode={isEditMode}
        isAssignedTagsView={isAssignedTagsView}
        tagList={filteredTagList}
        selectedFeatureId={selectedFeatureId}
      />
    );
  } else {
    const filterFeatureList = idIndex.filter(feature => selectedStatus[feature.calculatedStatus]);
    return <ListViewFeatureList featureList={filterFeatureList} selectedFeatureId={selectedFeatureId} />;
  }
};

export default FeatureList;
