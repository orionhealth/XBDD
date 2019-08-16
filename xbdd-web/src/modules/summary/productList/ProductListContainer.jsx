import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "@material-ui/core";
import ProductList from "./ProductList";
import Product from "../../../models/Product";

class ProductListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };

    this.handleProductClicked = this.handleProductClicked.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.list !== state.list) {
      return {
        list: props.list,
      };
    }
    return null;
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
        <ProductList
          list={this.state.list}
          isFavouriteList={this.props.isFavouriteList}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handleProductClicked={this.handleProductClicked}
        />
      </Card>
    );
  }
}

ProductListContainer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.instanceOf(Product)),
  isFavouriteList: PropTypes.bool.isRequired,
  handleFavouriteChange: PropTypes.func.isRequired,
};

export default ProductListContainer;
