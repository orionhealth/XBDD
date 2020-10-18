import React, { FC, MouseEvent } from 'react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { grey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updatePinStatusWithRollback } from 'redux/ReportReducer';
import { getEncodedURI } from 'lib/rest/URIHelper';
import { resetFeatureState } from 'redux/FeatureReducer';
import { useHistory } from 'react-router-dom';

interface Props {
  product: string;
  version: string;
  isPinned: boolean;
  buildList: string[];
}

const BuildListItem: FC<Props> = ({ product, version, isPinned, buildList }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
    <>
      {buildList.map(build => (
        <ListItem button key={build} onClick={(event: MouseEvent): void => onItemClick(event, build, isPinned)}>
          <ListItemText>{t('summary.buildDisplay', { build })}</ListItemText>
          <ListItemIcon>
            <Checkbox
              icon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[300] }} />}
              checkedIcon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[700] }} />}
              checked={isPinned}
            />
          </ListItemIcon>
        </ListItem>
      ))}
    </>
  );
};

export default BuildListItem;
