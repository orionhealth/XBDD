import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "@material-ui/core";
import ProductList from "./ProductList";
import Product from "../../../models/Product";

class ProductListContainer extends Component {
  constructor(props) {
    super(props);

    // const itemsUIState = {};
    // props.list.forEach(product => {
    //   if (!itemsUIState[product.name]) {
    //     itemsUIState[product.name] = {
    //       expanded: false,
    //       selectedVersion: product.versionList[0],
    //     };
    //   }
    // });
    this.state = {
      searchContent: null,
      itemsUIState: {},
    };

    this.getItemsUIState = this.getItemsUIState.bind(this);
    this.handleSearchProduct = this.handleSearchProduct.bind(this);
    this.handleProductClicked = this.handleProductClicked.bind(this);
    this.handleVersionSelected = this.handleVersionSelected.bind(this);
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.list !== state.list) {
  //     const itemsUIState = {};
  //     props.list.forEach(product => {
  //       if (!itemsUIState[product.name]) {
  //         itemsUIState[product.name] = {
  //           expanded: false,
  //           selectedVersion: product.versionList[0],
  //         };
  //       }
  //     });
  //     return {
  //       list: props.list,
  //       itemsUIState,
  //     };
  //   }
  //   return null;
  // }
  //
  getItemsUIState() {
    const itemsUIState = {};
    this.props.list.forEach(product => {
      const itemUIState = this.state.itemsUIState[product.name];
      itemsUIState[product.name] = {
        expanded: itemUIState && itemUIState.expanded ? itemUIState.expanded : false,
        selectedVersion: itemUIState && itemUIState.selectedVersion ? itemUIState.selectedVersion : product.versionList[0],
      };
    });
    return itemsUIState;
  }

  handleSearchProduct(event) {
    this.setState({ searchContent: event.target.value });
  }

  handleProductClicked(product) {
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      if (!newState.itemsUIState[product.name]) {
        newState.itemsUIState[product.name] = {};
      }
      const storedItem = newState.itemsUIState[product.name];
      storedItem.expanded = !storedItem.expanded;
      return newState;
    });
  }

  handleVersionSelected(event, product) {
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      if (!newState.itemsUIState[product.name]) {
        newState.itemsUIState[product.name] = {};
      }
      const storedItem = newState.itemsUIState[product.name];
      storedItem.selectedVersion = product.getVersionFromString(event.target.value);
      return newState;
    });
  }

  render() {
    var filteredList = this.props.list;
    if (this.state.searchContent) {
      const searchContent = this.state.searchContent.toLowerCase();
      filteredList = filteredList.filter(product => product.name.toLowerCase().indexOf(searchContent) !== -1);
    }
    return (
      <Card raised>
        <ProductList
          list={filteredList}
          itemsUIState={this.getItemsUIState()}
          title={this.props.title}
          handleSearchProduct={this.handleSearchProduct}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handlePinChange={this.props.handlePinChange}
          handleProductClicked={this.handleProductClicked}
          handleVersionSelected={this.handleVersionSelected}
          handleBuildSelected={this.props.handleBuildSelected}
        />
      </Card>
    );
  }
}

ProductListContainer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.instanceOf(Product)),
  title: PropTypes.string,
  handleFavouriteChange: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  handleBuildSelected: PropTypes.func.isRequired,
};

export default ProductListContainer;
