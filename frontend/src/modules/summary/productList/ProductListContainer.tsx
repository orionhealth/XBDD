import React, { Component, ChangeEvent, ReactNode } from 'react';
import { Card } from '@material-ui/core';
import produce from 'immer';

import ProductList from './ProductList';
import Product, { getVersionFromString } from 'models/Product';
import Version from 'models/Version';

interface Props {
  list: Product[];
  title: string;
  handleFavouriteChange(product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

interface State {
  searchContent: string;
  selectedVersionMap: Record<string, Version | undefined>;
}

class ProductListContainer extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { list } = this.props;
    const selectedVersionMap: Record<string, Version> = {};
    for (const { name, versionList } of list) {
      selectedVersionMap[name] = versionList[0];
    }

    this.state = {
      searchContent: '',
      selectedVersionMap,
    };
  }

  handleSearchProduct = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchContent: event.target.value });
  };

  handleVersionSelected = (event: ChangeEvent<{ value: string }>, product: Product): void => {
    this.setState(
      produce((draft: State) => {
        draft.selectedVersionMap[product.name] = getVersionFromString(product, event.target.value);
      })
    );
  };

  render(): ReactNode {
    const { list } = this.props;
    const { searchContent } = this.state;

    const filteredList = searchContent ? list.filter(product => product.name.toLowerCase().includes(searchContent.toLowerCase())) : list;

    return (
      <Card raised>
        <ProductList
          list={filteredList}
          selectedVersionMap={this.state.selectedVersionMap}
          title={this.props.title}
          handleFavouriteChange={this.props.handleFavouriteChange}
          handlePinChange={this.props.handlePinChange}
          handleSearchProduct={this.handleSearchProduct}
          handleVersionSelected={this.handleVersionSelected}
        />
      </Card>
    );
  }
}

export default ProductListContainer;
