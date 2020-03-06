import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

import ProductListStyles from './styles/ProductListStyles';
import BuildSummaryContainer from './buildSummary/BuildSummaryContainer';

const clickEventWrapper = (event, product, handleFavouriteChange, handleProductClicked) => {
  let node = event.target;

  while (node) {
    if (node.className === 'MuiIconButton-label') {
      handleFavouriteChange(product);
      return;
    }
    node = node.parentNode;
  }
  handleProductClicked(product);
};

const ProductListItem = props => {
  const {
    product,
    expandedProductsList,
    selectedVersionList,
    handleFavouriteChange,
    handleProductClicked,
    handleVersionSelected,
    handlePinChange,
    classes,
  } = props;

  const version = selectedVersionList[product.name] ? selectedVersionList[product.name] : product.versionList[0];

  return (
    <>
      <ListItem
        button
        className={classes.productListItem}
        onClick={e => clickEventWrapper(e, product, handleFavouriteChange, handleProductClicked)}
      >
        <ListItemIcon>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite style={{ color: red[300] }} />} checked={product.favourite} />
        </ListItemIcon>
        <ListItemText>{product.name}</ListItemText>
        {expandedProductsList.includes(product.name) ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expandedProductsList.includes(product.name)} timeout="auto" unmountOnExit>
        <BuildSummaryContainer
          product={product}
          version={version}
          handleVersionSelected={handleVersionSelected}
          handlePinChange={handlePinChange}
        />
      </Collapse>
    </>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.shape({}),
  expandedProductsList: PropTypes.arrayOf(PropTypes.string),
  selectedVersionList: PropTypes.shape({}),
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(ProductListStyles)(ProductListItem);
