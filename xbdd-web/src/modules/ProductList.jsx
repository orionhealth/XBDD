import React from "react";
import { List } from "@material-ui/core";
import ProductListItem from "./ProductListItem";

const ProductList = props => {
  const { list } = props;

  if (!list) {
    return null;
  } else {
    return (
      <List>
        {list.map(product => {
          return (
            <ProductListItem
              product={product}
              key={product.name}
              handleFavouriteChange={props.handleFavouriteChange}
              handleProductClicked={props.handleProductClicked}
            />
          );
        })}
      </List>
    );
  }
};

export default ProductList;
