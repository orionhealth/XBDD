import React, { FC, MouseEvent, ChangeEvent } from 'react';
import { Checkbox, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { red } from '@material-ui/core/colors';

import { useProductListStyles } from './styles/ProductListStyles';
import BuildSummaryContainer from './buildSummary/BuildSummaryContainer';
import Product from 'models/Product';
import Version from 'models/Version';

interface Props {
  product: Product;
  expandedProductsList: string[];
  selectedVersionList: Record<string, Version>;
  handleFavouriteChange(product: Product): void;
  handleProductClicked(product: Product): void;
  handleVersionSelected(event: ChangeEvent<unknown>, product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

const ProductListItem: FC<Props> = ({
  product,
  expandedProductsList,
  selectedVersionList,
  handleFavouriteChange,
  handleProductClicked,
  handleVersionSelected,
  handlePinChange,
}) => {
  const classes = useProductListStyles();
  const version = selectedVersionList[product.name] ? selectedVersionList[product.name] : product.versionList[0];

  const onItemClick = (event: MouseEvent): void => {
    let node: EventTarget | null = event.target;

    while (node && node instanceof Element) {
      if (node.className === 'MuiIconButton-label') {
        handleFavouriteChange(product);
        return;
      }
      if (node.parentNode instanceof Element) {
        node = node.parentNode;
      } else {
        node = null;
      }
    }
    handleProductClicked(product);
  };

  return (
    <>
      <ListItem button className={classes.productListItem} onClick={onItemClick}>
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

export default ProductListItem;
