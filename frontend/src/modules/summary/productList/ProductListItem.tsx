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

  const handleExpandCollapse = (e: MouseEvent): void => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleFavouriteProduct = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(updateFavouriteStatusWithRollback(product.name, product.favourite));
  };

  return (
    <>
      <ListItem button className={classes.productListItem} onClick={handleExpandCollapse}>
        <ListItemIcon>
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite className={classes.checkedFavourite} />}
            checked={product.favourite}
            onClick={handleFavouriteProduct}
          />
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
