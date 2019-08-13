import React, { Component } from "react";
import ProductSummary from "../models/ProductSummary";
import ProductList from "./ProductList";
import { Grid, Card, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import welcomeStyles from "./WelcomeStyles";

class ProductListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allProductList: null,
      favouriteProductList: null,
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.summaryData !== this.props.summaryData) {
      this.setState({
        allProductList: this.processList(this.props.summaryData, false),
        favouriteProductList: this.processList(this.props.summaryData, true),
      });
    }
  }

  onFavouriteChange = () => console.error('fav changed');

  // Remove the duplicate product and filter by favourtite
  processList(summaryData, isFavouriteList) {
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
        if(!isFavouriteList) {
          productList.push(element);
        } else {
          if(element.favourite) {
            productList.push(element);
          }
        }
      }
    });
    return productList;
  }

  render() {
    return (
      <Card>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3" className={this.props.classes.title}>G'day Mate</Typography>
        </Grid>
        <Grid item xs={6} className={this.props.classes.productList}>
          <Card raised>
            <Typography variant="h5" className={this.props.classes.productListTitle}>
              Product List
            </Typography>
            <ProductList productList={this.state.allProductList} onFavouriteChange={this.props.onFavouriteChange}/>
          </Card>
        </Grid>
        <Grid item xs={6} className={this.props.classes.productList}> 
          <Card raised>
            <Typography variant="h5" className={this.props.classes.productListTitle}>
              Favourite
            </Typography>
            <ProductList productList={this.state.favouriteProductList} onFavouriteChange={this.props.onFavouriteChange}/>
          </Card>
        </Grid>
      </Grid>
      </Card>
    );
  }
};

export default withStyles(welcomeStyles)(ProductListContainer);
