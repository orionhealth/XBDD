import React, { FC, useState, ReactNode } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { selectProductBuildAndVersion } from 'xbddReducer';
import Version, { getString, getUnpinnedBuildList } from 'models/Version';
import { useBuildListStyles } from './styles/BuildListStyles';
import BuildListItem from './BuildListItem';
import Product from 'models/Product';

interface Props {
  product: Product;
  version: Version;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

const BuildList: FC<Props> = ({ product, version, handlePinChange }) => {
  const { t } = useTranslation();
  const classes = useBuildListStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);

  const pinnedBuildList = version.pinnedBuildList;
  let unpinnedBuildList = getUnpinnedBuildList(version);
  const isExpandable = unpinnedBuildList.length > 5;

  if (isExpandable && !expanded) {
    unpinnedBuildList = unpinnedBuildList.slice(0, 5);
  }

  const onItemClick = (event, build: string, isPinned: boolean): void => {
    let node = event.target;
    while (node) {
      if (node.className === 'MuiIconButton-label') {
        handlePinChange(product, version, build, isPinned);
        return;
      }
      node = node.parentNode;
    }
    dispatch(selectProductBuildAndVersion({ product: product.name, version: getString(version), build }));
    history.push('/reports/' + [product.name, getString(version), build].join('/'));
  };

  const renderBuildListByPin = (buildList: string[], isPinned: boolean): ReactNode => (
    <List>
      <List>
        <BuildListItem isPinned={isPinned} buildList={buildList} onClick={onItemClick} />
        {isPinned || !isExpandable ? null : (
          <ListItem button divider className={classes.buildListItem} onClick={(): void => setExpanded(!expanded)}>
            <ListItemIcon className={classes.arrowIcon}>
              <FontAwesomeIcon icon={expanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </ListItemIcon>
            <ListItemText>{expanded ? t('summary.showLess') : t('summary.showMore')}</ListItemText>
          </ListItem>
        )}
      </List>
    </List>
  );

  return (
    <div className={classes.buildListContainer}>
      {pinnedBuildList.length !== 0 ? renderBuildListByPin(pinnedBuildList, true) : null}
      {unpinnedBuildList.length !== 0 ? renderBuildListByPin(unpinnedBuildList, false) : null}
    </div>
  );
};

export default BuildList;
