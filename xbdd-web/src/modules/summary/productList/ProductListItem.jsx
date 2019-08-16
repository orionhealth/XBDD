import React from "react";
import PropTypes from "prop-types";
import { List, Checkbox, ListItem, ListItemText, ListItemIcon, Collapse } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import ProductListStyles from "./styles/ProductListStyles";
import Product from "../../../models/Product";

const ProductListItem = props => {
  function clickEventWrapper(event) {
    let node = event.target;

    while (node) {
      if (node.className === "MuiIconButton-label") {
        props.handleFavouriteChange(props.product);
        return;
      }
      node = node.parentNode;
    }
    props.handleProductClicked(props.product);
  }

  return (
    <div onClick={e => clickEventWrapper(e)}>
      <ListItem button divider className={props.classes.productListItem}>
        <ListItemIcon>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={props.product.favourite} />
        </ListItemIcon>
        <ListItemText>{props.product.name}</ListItemText>
        {props.product.expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={props.product.expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <div>Here should be a list of build data</div>
        </List>
      </Collapse>
    </div>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.instanceOf(Product),
  classes: PropTypes.shape({}),
};

export default withStyles(ProductListStyles)(ProductListItem);
