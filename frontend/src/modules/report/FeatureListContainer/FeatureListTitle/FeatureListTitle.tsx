import { faUserSlash, faUserTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography } from '@material-ui/core';
import React, { Dispatch, SetStateAction, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useFeatureListTitleStyles } from './styles/FeatureListTitleStyles';
import ViewSwitcher from './ViewSwitcher';

interface Props {
  isEditMode: boolean;
  isTagView: boolean;
  isAssignedTagsView: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setAssignedTagsView: Dispatch<SetStateAction<boolean>>;
  setTagView: Dispatch<SetStateAction<boolean>>;
}

const FeatureListTitle: FC<Props> = props => {
  const { t } = useTranslation();
  const classes = useFeatureListTitleStyles();

  const { isEditMode, isTagView, isAssignedTagsView, setEditMode, setAssignedTagsView, setTagView } = props;

  return (
    <div className={classes.featureListTitle}>
      <Box p={1} flexGrow={1}>
        <Typography variant="h5">{t('featureList.features')}</Typography>
      </Box>
      {isTagView && (
        <>
          <ViewSwitcher
            flag={isEditMode}
            flagSetter={setEditMode}
            titleOn={t('report.turnEditModeOff')}
            titleOff={t('report.turnEditModeOn')}
            iconName={faUserSlash}
          />
          <ViewSwitcher
            flag={isAssignedTagsView}
            flagSetter={setAssignedTagsView}
            titleOn={t('report.showAllTags')}
            titleOff={t('report.turnEditModeOn')}
            iconName={faUserTag}
          />
        </>
      )}
      <ViewSwitcher
        flag={isTagView}
        flagSetter={setTagView}
        titleOn={t('report.switchToListView')}
        titleOff={t('report.switchToTagView')}
        iconName={faTags}
      />
    </div>
  );
};

export default FeatureListTitle;
