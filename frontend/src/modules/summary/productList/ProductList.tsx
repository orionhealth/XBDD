import React, { FC, ChangeEvent } from 'react';
import { List, Typography, TextField, Grid, Box } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

import { useProductListStyles } from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';
import Product from 'models/Product';
import Version from 'models/Version';

interface Props {
  list: Product[];
  title: string;
  expandedProductsList: string[];
  selectedVersionList: Record<string, Version>;
  handleSearchProduct(event: ChangeEvent<HTMLInputElement>): void;
  handleFavouriteChange(product: Product): void;
  handleProductClicked(product: Product): void;
  handleVersionSelected(event: ChangeEvent<unknown>, product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

const ProductList: FC<Props> = ({
  list,
  title,
  expandedProductsList,
  selectedVersionList,
  handleSearchProduct,
  handleFavouriteChange,
  handleProductClicked,
  handleVersionSelected,
  handlePinChange,
}) => {
  const classes = useProductListStyles();

  if (!list) {
    return null;
  }
  return (
    <>
      <Box color="primary">
        <Typography variant="h5" className={classes.productListTitle}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={1} className={classes.searchBar}>
        <Grid item>
          <Search />
        </Grid>
        <Grid item>
          <TextField label="Search" onChange={handleSearchProduct} />
        </Grid>
      </Grid>

      <List>
        {list.map(product => {
          return (
            <ProductListItem
              product={product}
              expandedProductsList={expandedProductsList}
              selectedVersionList={selectedVersionList}
              key={product.name}
              handleFavouriteChange={handleFavouriteChange}
              handleProductClicked={handleProductClicked}
              handleVersionSelected={handleVersionSelected}
              handlePinChange={handlePinChange}
            />
          );
        })}
      </List>
    </>
  );
};

export default ProductList;
