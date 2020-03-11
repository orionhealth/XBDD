import React, { FC, MouseEvent, ChangeEvent, useState } from 'react';
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
  version: Version;
  handleFavouriteChange(product: Product): void;
  handleVersionSelected(event: ChangeEvent<unknown>, product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

const ProductListItem: FC<Props> = ({ product, version, handleFavouriteChange, handleVersionSelected, handlePinChange }) => {
  const classes = useProductListStyles();
  const [expanded, setExpanded] = useState(false);

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
    setExpanded(!expanded);
  };

  return (
    <>
      <ListItem button className={classes.productListItem} onClick={onItemClick}>
        <ListItemIcon>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite style={{ color: red[300] }} />} checked={product.favourite} />
        </ListItemIcon>
        <ListItemText>{product.name}</ListItemText>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
