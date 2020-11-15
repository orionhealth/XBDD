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
import { updateFavouriteStatusWithRollback } from 'redux/ReportReducer';

interface Props {
  product: Product;
}

const ProductListItem: FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const classes = useProductListStyles();
  const [expanded, setExpanded] = useState(false);

  const onItemClick = (e: MouseEvent): void => {
    let node: EventTarget | null = e.target;

    while (node && node instanceof Element) {
      if (node.className === 'MuiIconButton-label') {
        dispatch(updateFavouriteStatusWithRollback(product.name, product.favourite));
        return;
      }
      node = node.parentNode instanceof Element ? node.parentNode : null;
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
        <BuildSummaryContainer product={product} />
      </Collapse>
    </>
  );
};

export default ProductListItem;
