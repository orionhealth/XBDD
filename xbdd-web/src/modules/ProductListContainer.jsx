import React, { Component } from "react";
import ProductList from "./ProductList";
import { Card, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import welcomeStyles from "./WelcomeStyles";
import {} from "../lib/rest/Rest";

class ProductListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };

    this.handleProductClicked = this.handleProductClicked.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.list !== this.state.list) {
      this.setState({
        list: props.list,
      });
    }
  }

  handleExpanded(productList) {
    return productList;
  }

  handleProductClicked(product) {
    var list = [];
    if (product.favourite) {
      list = this.state.favouriteProductList;
    } else {
      list = this.state.allProductList;
    }
    list.forEach(item => {});
  }

  render() {
    return (
      <Card raised>
        <Typography variant="h5" className={this.props.classes.productListTitle}>
          {this.props.isFavouriteList ? "Favourite" : "Product List"}
        </Typography>
        <ProductList
          expandedProducts={this.expandedProducts}
          list={this.state.list}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handleProductClicked={this.handleProductClicked}
        />
      </Card>
    );
  }
}

export default withStyles(welcomeStyles)(ProductListContainer);
