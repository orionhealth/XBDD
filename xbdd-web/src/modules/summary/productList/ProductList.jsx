import React from "react";
import PropTypes from "prop-types";
import { List, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ProductListStyles from "./styles/ProductListStyles";
import ProductListItem from "./ProductListItem";
import Product from "../../../models/Product";
import Version from "../../../models/Version";

const ProductList = props => {
  if (!props.list) {
    return null;
  }
  return (
    <>
      <Typography variant="h5" className={props.classes.productListTitle}>
        {props.title}
      </Typography>
      <List>
        {props.list.map(product => {
          return (
            <ProductListItem
              product={product}
              itemUIState={props.itemsUIState[product.name]}
              key={product.name}
              version={props.version}
              handleFavouriteChange={props.handleFavouriteChange}
              handleProductClicked={props.handleProductClicked}
              handleVersionSelected={props.handleVersionSelected}
              handlePinChange={props.handlePinChange}
            />
          );
        })}
      </List>
    </>
  );
};

ProductList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.instanceOf(Product)),
  title: PropTypes.string,
  version: PropTypes.instanceOf(Version),
  itemUIState: PropTypes.arrayOf(
    PropTypes.shape({
      expanded: PropTypes.bool,
      selectedVersion: PropTypes.instanceOf(Version),
    })
  ),
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};
export default withStyles(ProductListStyles)(ProductList);
