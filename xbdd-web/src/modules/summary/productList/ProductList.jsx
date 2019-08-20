import React from "react";
import PropTypes from "prop-types";
import { List, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ProductListStyles from "./styles/ProductListStyles";
import ProductListItem from "./ProductListItem";

const ProductList = props => {
  if (!props.list) {
    return null;
  }
  return (
    <>
      <Typography variant="h5" className={props.classes.productListTitle}>
        {props.isFavouriteList ? "Favourite" : "Product List"}
      </Typography>
      <List>
        {props.list.map(product => {
          return (
            <ProductListItem
              product={product}
              itemUIState={props.itemsUIState[product.name]}
              key={product.name}
              version={props.version}
              handleVersionSelected={props.handleVersionSelected}
              handleFavouriteChange={props.handleFavouriteChange}
              handleProductClicked={props.handleProductClicked}
              handlePinChange={props.handlePinChange}
            />
          );
        })}
      </List>
    </>
  );
};

ProductList.propTypes = {
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};
export default withStyles(ProductListStyles)(ProductList);
