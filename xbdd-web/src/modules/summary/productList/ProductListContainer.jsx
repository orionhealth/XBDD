import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "@material-ui/core";
import ProductList from "./ProductList";
import Product from "../../../models/Product";

const getVersionString = version => {
  return `${version.major}.${version.minor}.${version.servicePack}`;
};

class ProductListContainer extends Component {
  constructor(props) {
    super(props);
    const itemsUIState = {};
    props.list.forEach(item => {
      itemsUIState[item.name] = {
        expanded: false,
        selectedVersion: item.versionList[0],
      };
    });
    this.state = {
      list: props.list,
      itemsUIState,
    };

    this.handleProductClicked = this.handleProductClicked.bind(this);
    this.handleVersionSelected = this.handleVersionSelected.bind(this);
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
    // var newList = this.state.list;
    // const isExpanded = product.expanded;
    // newList.forEach(element => {
    //   if (element === product) {
    //     element.expanded = !isExpanded;
    //   }
    // });
    // this.setState({
    //   list: newList,
    // });

    this.setState(oldState => {
      const newState = Object.assign({}, oldState);
      const storedItem = newState.itemsUIState[product.name];
      storedItem.expanded = !storedItem.expanded;
      return newState;
    });
  }

  getVersionFromString(versionString, productName) {
    const correctProduct = this.state.list.find(product => product.name === productName);
    return correctProduct.versionList.find(version => versionString === getVersionString(version));
  }

  handleVersionSelected(event, productNeededToUpdate) {
    // const newList = this.state.list;
    // const product = newList.find(item => item === productNeededToUpdate);
    // const newSelectedVersion = event.target.value;
    // product.versionList.forEach(version => {
    //   if (newSelectedVersion === `${version.major}.${version.minor}.${version.servicePack}`) {
    //     product.selectedVersion = version;
    //   }
    // });
    // this.setState({
    //   list: newList,
    // });

    this.setState(oldState => {
      const newState = Object.assign({}, oldState);
      const storedItem = newState.itemsUIState[productNeededToUpdate.name];
      storedItem.selectedVersion = this.getVersionFromString(event.target.value, productNeededToUpdate.name);
      return newState;
    });
  }

  render() {
    return (
      <Card raised>
        <ProductList
          list={this.state.list}
          itemsUIState={this.state.itemsUIState}
          isFavouriteList={this.props.isFavouriteList}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handlePinChange={this.props.handlePinChange}
          handleProductClicked={this.handleProductClicked}
          handleVersionSelected={this.handleVersionSelected}
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
