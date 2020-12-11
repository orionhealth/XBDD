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

  const onItemClick = (e: MouseEvent<HTMLElement>, build: string, isPinned: boolean): void => {
    let node: EventTarget | null = e.target;
    while (node && node instanceof Element) {
      if (node.className === 'MuiIconButton-label') {
        dispatch(updatePinStatusWithRollback(product, version, build, isPinned));
        return;
      }
      node = node.parentNode instanceof Element ? node.parentNode : null;
    }
    dispatch(resetFeatureState());
    history.push(`/reports/${getEncodedURI(product, version, build)}`);
  };

  const publishDate = build.publishDate ? new Date(build.publishDate) : 'Unknown Publish Date';

  return (
    <ListItem button onClick={(e: MouseEvent<HTMLElement>): void => onItemClick(e, build.name, build.isPinned)}>
      <ListItemText>{t('summary.buildDisplay', { name: build.name, publishDate })}</ListItemText>
      <ListItemIcon>
        <Checkbox
          icon={<FontAwesomeIcon icon={faThumbtack} className={classes.unpinnedBuild} />}
          checkedIcon={<FontAwesomeIcon icon={faThumbtack} className={classes.pinnedBuild} />}
          checked={build.isPinned}
        />
      </ListItemIcon>
    </ListItem>
  );
};

export default BuildListItem;
