import React from "react";
import { List } from "@material-ui/core";
import ProductListItem from "./ProductListItem";

const ProductList = props => {
  const { productList } = props;

  if (!productList) {
    return null;
  } else {
    return (
      <List>
        {productList.map(product => {
          return <ProductListItem product={product} key={product.name} onFavouriteChange={props.onFavouriteChange}/>;
        })}
      </List>
    );
  }
};

export default ProductList;
