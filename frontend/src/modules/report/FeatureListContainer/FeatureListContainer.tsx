import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { useFeatureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons';
import Loading from 'modules/loading/Loading';
import { LoggedInUser } from 'models/User';
import { RootStore } from 'rootReducer';
import Status, { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import FeatureListTitle from './FeatureListTitle/FeatureListTitle';
import FeatureList from './FeatureList/FeatureList';

interface Props {
  user: LoggedInUser;
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

  const [isPassSelected, setPassSelected] = useState(true);
  const [isFailedSelected, setFailedSelected] = useState(true);
  const [isUndefinedSelected, setUndefinedSelected] = useState(true);
  const [isSkippedSelected, setSkippedSelected] = useState(true);

  const selectedStatus: StatusMap<boolean> = {
    [Passed]: isPassSelected,
    [Failed]: isFailedSelected,
    [Undefined]: isUndefinedSelected,
    [Skipped]: isSkippedSelected,
  };

  const handlerMap: StatusMap<(isSelected: boolean) => void> = {
    [Passed]: setPassSelected,
    [Failed]: setFailedSelected,
    [Undefined]: setUndefinedSelected,
    [Skipped]: setSkippedSelected,
  };

  const handleFilterButtonClick = (filterSelected: Status): void => {
    handlerMap[filterSelected](!selectedStatus[filterSelected]);
  };

  const { user, selectedFeatureId } = props;

  return (
    <>
      <Loading loading={loading} />
      <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={handleFilterButtonClick} />
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
          selectedStatus={selectedStatus}
        />
      </div>
    </>
  );
};

export default FeatureListContainer;
