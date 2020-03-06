import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';

import ProductList from './ProductList';
import { getVersionFromString } from 'models/Product';

class ProductListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchContent: null,
      expandedProductsList: [],
      selectedVersionList: {},
    };

    this.handleSearchProduct = this.handleSearchProduct.bind(this);
    this.handleProductClicked = this.handleProductClicked.bind(this);
    this.handleVersionSelected = this.handleVersionSelected.bind(this);
  }

  handleSearchProduct(event) {
    this.setState({ searchContent: event.target.value });
  }

  handleProductClicked(product) {
    if (this.state.expandedProductsList.includes(product.name)) {
      const newExpandedProductsList = [...this.state.expandedProductsList];
      const index = newExpandedProductsList.indexOf(product.name);
      newExpandedProductsList.splice(index, 1);
      this.setState({ expandedProductsList: newExpandedProductsList });
    } else {
      this.setState({ expandedProductsList: [...this.state.expandedProductsList, product.name] });
    }
  }

  handleVersionSelected(event, product) {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        selectedVersionList: Object.assign({}, prevState.selectedVersionList, {
          [product.name]: getVersionFromString(product, event.target.value),
        }),
      })
    );
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
          expandedProductsList={this.state.expandedProductsList}
          selectedVersionList={this.state.selectedVersionList}
          title={this.props.title}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handlePinChange={this.props.handlePinChange}
          handleSearchProduct={this.handleSearchProduct}
          handleProductClicked={this.handleProductClicked}
          handleVersionSelected={this.handleVersionSelected}
        />
      </Card>
    );
  }
}

ProductListContainer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  handleFavouriteChange: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
};

export default ProductListContainer;
