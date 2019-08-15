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

  handleProductClicked(product) {
    var newList = this.state.list;
    const isExpanded = product.expanded;
    newList.forEach(element => {
      if (element === product) {
        element.expanded = !isExpanded;
      }
    });
    this.setState({
      list: newList,
    });
  }

  render() {
    return (
      <Card raised>
        <Typography variant="h5" className={this.props.classes.productListTitle}>
          {this.props.isFavouriteList ? "Favourite" : "Product List"}
        </Typography>
        <ProductList
          list={this.state.list}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handleProductClicked={this.handleProductClicked}
        />
      </Card>
    );
  }
}

export default withStyles(welcomeStyles)(ProductListContainer);
