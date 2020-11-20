import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { useFeatureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons';
import Loading from 'modules/loading/Loading';
import { User } from 'models/User';
import { RootStore } from 'rootReducer';
import FeatureListTitle from './FeatureListTitle/FeatureListTitle';
import FeatureList from './FeatureList/FeatureList';

interface Props {
  user: User;
  selectedFeatureId?: string;
}

const FeatureListContainer: FC<Props> = props => {
  const classes = useFeatureListContainerStyles();

  const idIndex = useSelector((state: RootStore) => state.feature.byId);
  const tagIndex = useSelector((state: RootStore) => state.feature.byTag);
  const tagAssignments = useSelector((state: RootStore) => state.tags.assignments);
  const ignoredTag = useSelector((state: RootStore) => state.tags.ignored);
  const loading = !(idIndex && tagIndex && tagAssignments && ignoredTag);

  const [isEditMode, setEditMode] = useState(false);
  const [isAssignedTagsView, setAssignedTagsView] = useState(false);
  const [isTagView, setTagView] = useState(true);

  const { user, selectedFeatureId } = props;

  return (
    <>
      <Loading loading={loading} />
      <FeatureFilterButtons />
      <div className={classes.tagListContainer}>
        <FeatureListTitle
          isEditMode={isEditMode}
          isTagView={isTagView}
          isAssignedTagsView={isAssignedTagsView}
          setTagView={setTagView}
          setEditMode={setEditMode}
          setAssignedTagsView={setAssignedTagsView}
        />
        <FeatureList
          isEditMode={isEditMode}
          isTagView={isTagView}
          isAssignedTagsView={isAssignedTagsView}
          user={user}
          selectedFeatureId={selectedFeatureId}
        />
      </div>
    </>
  );
};

export default FeatureListContainer;
