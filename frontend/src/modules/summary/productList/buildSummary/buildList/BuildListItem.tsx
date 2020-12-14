import React, { FC, MouseEvent } from 'react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { updatePinStatusWithRollback } from 'redux/ReportReducer';
import { getEncodedURI } from 'lib/rest/URIHelper';
import { resetFeatureState } from 'redux/FeatureReducer';
import Build from 'models/Build';
import { useBuildListStyles } from './styles/BuildListStyles';

interface Props {
  product: string;
  version: string;
  build: Build;
}

const BuildListItem: FC<Props> = ({ product, version, build }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useBuildListStyles();
  const history = useHistory();

  const handleSelectBuild = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    dispatch(resetFeatureState());
    history.push(`/reports/${getEncodedURI(product, version, build.name)}`);
  };

  const handlePinBuild = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    dispatch(updatePinStatusWithRollback(product, version, build.name, build.isPinned));
  };

  const publishDate = build.publishDate ? new Date(build.publishDate) : 'Unknown Publish Date';

  return (
    <ListItem button onClick={handleSelectBuild}>
      <ListItemText>{t('summary.buildDisplay', { name: build.name, publishDate })}</ListItemText>
      <ListItemIcon>
        <Checkbox
          icon={<FontAwesomeIcon icon={faThumbtack} className={classes.unpinnedBuild} />}
          checkedIcon={<FontAwesomeIcon icon={faThumbtack} className={classes.pinnedBuild} />}
          checked={build.isPinned}
          onClick={handlePinBuild}
        />
      </ListItemIcon>
    </ListItem>
  );
};

export default BuildListItem;
