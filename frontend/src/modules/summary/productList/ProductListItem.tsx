import React, { FC, MouseEvent, useState } from 'react';
import { Checkbox, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux';

import { useProductListStyles } from './styles/ProductListStyles';
import BuildSummaryContainer from './buildSummary/BuildSummaryContainer';
import Product from 'models/Product';
import Version from 'models/Version';
import { updateFavouriteStatusWithRollback } from 'redux/ReportReducer';

interface Props {
  product: Product;
  version: Version;
}

const ProductListItem: FC<Props> = ({ product, version }) => {
  const dispatch = useDispatch();
  const classes = useProductListStyles();
  const [expanded, setExpanded] = useState(false);

  const onItemClick = (event: MouseEvent): void => {
    let node: EventTarget | null = event.target;

    while (node && node instanceof Element) {
      if (node.className === 'MuiIconButton-label') {
        dispatch(updateFavouriteStatusWithRollback(product.name, product.favourite));
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
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite className={classes.checkedFavourite} />} checked={product.favourite} />
        </ListItemIcon>
        <ListItemText>{product.name}</ListItemText>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <BuildSummaryContainer product={product} version={version} />
      </Collapse>
    </>
  );
};

export default ProductListItem;
