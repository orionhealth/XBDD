import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { selectProductBuildAndVersion } from 'xbddReducer';
import { getString, getUnpinnedBuildList } from 'models/Version';
import Product from 'models/Product';
import { buildListStyles } from './styles/BuildListStyles';
import BuildListItem from './BuildListItem';

const BuildList = props => {
  const { product, version, expandedBuildList, handlePinChange, handleBuildListExpanded, classes, t } = props;
  const dispatch = useDispatch();
  const pinnedBuildList = version.pinnedBuildList;
  let unpinnedBuildList = getUnpinnedBuildList(version);
  const productVersionId = `${product.name} ${getString(version)}`;
  const isBuildListExpanded = expandedBuildList.includes(productVersionId);
  const isBigBuildList = unpinnedBuildList.length > 5;

  if (isBigBuildList && !isBuildListExpanded) {
    unpinnedBuildList = unpinnedBuildList.slice(0, 5);
  }

  const clickEventWrapper = (event, product, version, build, isPinned, handlePinChange) => {
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

  const renderBuildListByPin = (buildList, isPinned) => (
    <List>
      <BuildListItem
        product={product}
        version={version}
        isPinned={isPinned}
        buildList={buildList}
        handlePinChange={handlePinChange}
        clickEventWrapper={clickEventWrapper}
      />
      {isPinned || !isBigBuildList ? null : (
        <ListItem button divider className={classes.buildListItem} onClick={() => handleBuildListExpanded(productVersionId)}>
          <ListItemIcon className={classes.arrowIcon}>
            <FontAwesomeIcon icon={isBuildListExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
          </ListItemIcon>
          <ListItemText>{isBuildListExpanded ? t('summary.showLess') : t('summary.showMore')}</ListItemText>
        </ListItem>
      )}
    </List>
  );

  return (
    <div className={classes.buildListContainer}>
      {pinnedBuildList.length !== 0 ? renderBuildListByPin(pinnedBuildList, true) : null}
      {unpinnedBuildList.length !== 0 ? renderBuildListByPin(unpinnedBuildList, false) : null}
    </div>
  );
};

BuildList.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.shape({}),
  expandedBuildList: PropTypes.arrayOf(PropTypes.string),
  handlePinChange: PropTypes.func.isRequired,
  handleBuildListExpanded: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withTranslation()(withStyles(buildListStyles)(BuildList));
