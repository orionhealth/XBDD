import React, { FC, MouseEvent } from 'react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updatePinStatusWithRollback } from 'redux/ReportReducer';
import { getEncodedURI } from 'lib/rest/URIHelper';
import { resetFeatureState } from 'redux/FeatureReducer';
import { useHistory } from 'react-router-dom';
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

  const onItemClick = (event, build: string, isPinned: boolean): void => {
    let node = event.target;
    while (node) {
      if (node.className === 'MuiIconButton-label') {
        dispatch(updatePinStatusWithRollback(product, version, build, isPinned));
        return;
      }
      node = node.parentNode;
    }
    dispatch(resetFeatureState());
    history.push(`/reports/${getEncodedURI(product, version, build)}`);
  };

  return (
    <ListItem button onClick={(event: MouseEvent): void => onItemClick(event, build.name, build.isPinned)}>
      <ListItemText>{t('summary.buildDisplay', { name: build.name, publishDate: new Date(build.publishDate) })}</ListItemText>
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
