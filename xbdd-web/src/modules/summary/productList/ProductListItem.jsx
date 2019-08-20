import React from "react";
import PropTypes from "prop-types";
import { Checkbox, ListItem, ListItemText, ListItemIcon, Collapse } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import ProductListStyles from "./styles/ProductListStyles";
import Product from "../../../models/Product";
import BuildSummaryContainer from "./buildSummary/BuildSummaryContainer";

const clickEventWrapper = (event, product, handleFavouriteChange, handleProductClicked) => {
  let node = event.target;

  while (node) {
    if (node.className === "MuiIconButton-label") {
      handleFavouriteChange(product);
      return;
    }
    node = node.parentNode;
  }
  handleProductClicked(product);
};

const ProductListItem = props => {
  return (
    <>
      <ListItem
        button
        divider
        className={props.classes.productListItem}
        onClick={e => clickEventWrapper(e, props.product, props.handleFavouriteChange, props.handleProductClicked)}
      >
        <ListItemIcon>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={props.product.favourite} />
        </ListItemIcon>
        <ListItemText>{props.product.name}</ListItemText>
        {props.itemUIState.expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={props.itemUIState.expanded} timeout="auto" unmountOnExit>
        <BuildSummaryContainer
          product={props.product}
          version={props.itemUIState.selectedVersion}
          handleVersionSelected={props.handleVersionSelected}
          handlePinChange={props.handlePinChange}
        />
      </Collapse>
    </>
  );
};

ProductListItem.propTypes = {
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  product: PropTypes.instanceOf(Product),
  classes: PropTypes.shape({}),
};

export default withStyles(ProductListStyles)(ProductListItem);
