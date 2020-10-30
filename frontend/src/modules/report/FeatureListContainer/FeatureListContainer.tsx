import React, { FC, ReactNode, useState } from 'react';
import { Typography, Checkbox, Tooltip, Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faUserTag, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useFeatureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons/FeatureFilterButtons';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';
import Loading from 'modules/loading/Loading';
import { LoggedInUser } from 'models/User';
import Tag from 'models/Tag';
import { RootStore } from 'rootReducer';
import Status, { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';

interface Props {
  user: LoggedInUser;
  selectedFeatureId?: string;
}

interface State {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  isTagView: boolean;
  selectedStatus: StatusMap<boolean>;
}

const FeatureListContainer: FC<Props> = props => {
  const classes = useFeatureListContainerStyles();
  const { t } = useTranslation();

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

  const selectedStatus = {
    [Passed]: isPassSelected,
    [Failed]: isFailedSelected,
    [Undefined]: isUndefinedSelected,
    [Skipped]: isSkippedSelected,
  };

  const handlerMap = {
    [Passed]: setPassSelected,
    [Failed]: setFailedSelected,
    [Undefined]: setUndefinedSelected,
    [Skipped]: setSkippedSelected,
  };

  const handleFilterButtonClick = (filterSelected: Status): void => {
    handlerMap[filterSelected](!selectedStatus[filterSelected]);
  };

  const { user, selectedFeatureId } = props;

  const filterTags = (): Tag[] => {
    let filteredTagList = tagIndex || [];

    if (tagAssignments && isAssignedTagsView) {
      filteredTagList = filteredTagList.filter(tag => tagAssignments[tag.name]?.userId === user.userId);
    }
    filteredTagList = filteredTagList.filter(tag => tag.features.find(feature => selectedStatus[feature.calculatedStatus]));

    return filteredTagList;
  };

  const renderAssignedTagsSwitch = (): ReactNode => {
    const editModeTitle = isEditMode ? t('report.turnEditModeOff') : t('report.turnEditModeOn');
    const assignedTagsTitle = isAssignedTagsView ? t('report.showAllTags') : t('report.showAssignedTags');

    return (
      <>
        <Tooltip title={editModeTitle} placement="top">
          <Checkbox
            onChange={(): void => setEditMode(!isEditMode)}
            icon={<FontAwesomeIcon icon={faUserSlash} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserSlash} className={classes.checkedIcon} />}
            checked={isEditMode}
          />
        </Tooltip>
        <Tooltip title={assignedTagsTitle} placement="top">
          <Checkbox
            onChange={(): void => setAssignedTagsView(!isAssignedTagsView)}
            icon={<FontAwesomeIcon icon={faUserTag} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserTag} className={classes.checkedIcon} />}
            checked={isAssignedTagsView}
          />
        </Tooltip>
      </>
    );
  };

  const renderViewsSwitch = (): ReactNode => {
    const title = isTagView ? t('report.switchToListView') : t('report.switchToTagView');

    return (
      <Tooltip title={title} placement="top">
        <Checkbox
          onChange={(): void => setTagView(!isTagView)}
          icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
          checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
          checked={isTagView}
        />
      </Tooltip>
    );
  };

  const renderFeatureListTitle = (): ReactNode => {
    return (
      <Box className={classes.featureListTitle}>
        <Box p={1} flexGrow={1}>
          <Typography variant="h5">{t('featureList.features')}</Typography>
        </Box>
        <Box>
          {isTagView ? renderAssignedTagsSwitch() : null}
          {renderViewsSwitch()}
        </Box>
      </Box>
    );
  };

  const renderFeatureList = (selectedFeatureId?: string): ReactNode => {
    if (isTagView && tagAssignments) {
      return (
        <TagList
          isEditMode={isEditMode}
          isAssignedTagsView={isAssignedTagsView}
          tagList={filterTags()}
          tagAssignments={tagAssignments}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={selectedStatus}
        />
      );
    } else if (idIndex) {
      return <ListViewFeatureList selectedFeatureId={selectedFeatureId} featureList={idIndex} selectedStatus={selectedStatus} />;
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={handleFilterButtonClick} />
      <div className={classes.tagListContainer}>
        {renderFeatureListTitle()}
        {renderFeatureList(selectedFeatureId)}
      </div>
    </>
  );
};

export default FeatureListContainer;
