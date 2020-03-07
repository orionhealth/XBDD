import React, { FC, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
  const [expanded, setExpanded] = useState(false);

  const pinnedBuildList = version.pinnedBuildList;
  const isPinned = pinnedBuildList.length !== 0;
  let listToRender = isPinned ? pinnedBuildList : getUnpinnedBuildList(version);
  const isExpandable = listToRender.length > 5;

  if (isExpandable && !expanded) {
    listToRender = listToRender.slice(0, 5);
  }

  const onItemClick = (event, build: string): void => {
    let node = event.target;
    while (node) {
      if (node.className === 'MuiIconButton-label') {
        handlePinChange(product, version, build, isPinned);
        return;
      }
      node = node.parentNode;
    }
    dispatch(selectProductBuildAndVersion({ product: product.name, version: getString(version), build }));
  };

  return (
    <div className={classes.buildListContainer}>
      <List>
        <BuildListItem isPinned={isPinned} buildList={listToRender} onClick={onItemClick} />
        {isPinned || !isExpandable ? null : (
          <ListItem button divider className={classes.buildListItem} onClick={(): void => setExpanded(!expanded)}>
            <ListItemIcon className={classes.arrowIcon}>
              <FontAwesomeIcon icon={expanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </ListItemIcon>
            <ListItemText>{expanded ? t('summary.showLess') : t('summary.showMore')}</ListItemText>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default BuildList;
