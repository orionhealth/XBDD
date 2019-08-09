import React from "react";
import ProductSummary from "../models//ProductSummary";
import { List, ListItem, Card, Typography } from "@material-ui/core";
import { withStyles} from '@material-ui/core/styles';
import welcomeStyles from './WelcomeStyles';

const ProductList = props => {
  const { isFavouriteList } = props;

  function renderUpdatedData() {
    const { summaryData } = props;
    if (!summaryData) {
      return null;
    }
    const productListData = new ProductSummary(summaryData).productList;
    const productList = [];
    productListData.forEach(element => {
      var flag = true;
      productList.forEach(product => {
        if (product.name === element.name) {
          flag = false;
        }
      });
      if (flag) {
        productList.push(element);
      }
    });

    return productList.map(renderList);
  }

  function renderList(product) {
    if(isFavouriteList) {
      return product.favourite && <ListItem button key={product.name}>{product.name}</ListItem>;
    } else {
      return <ListItem button divider key={product.name}>{product.name}</ListItem>;
    }
  }

  return (
    <Card raised>
      <Typography variant="h5" className={props.classes.productListTitle}>{isFavouriteList? 'Favourite' : 'Product List'}</Typography>
      <List>{renderUpdatedData()}</List>
    </Card>
  );
};

export default withStyles(welcomeStyles)(ProductList);
