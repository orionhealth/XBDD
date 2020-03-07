import React, { FC, ChangeEvent } from 'react';
import { List, Typography, TextField, Grid, Box } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

import { useProductListStyles } from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';
import Product from 'models/Product';
import Version from 'models/Version';

interface Props {
  list: Product[];
  selectedVersionMap: Record<string, Version | undefined>;
  title: string;
  handleFavouriteChange(product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
  handleSearchProduct(event: ChangeEvent<HTMLInputElement>): void;
  handleVersionSelected(event: ChangeEvent<{ value: string }>, product: Product): void;
}

const ProductList: FC<Props> = ({
  list,
  title,
  selectedVersionMap,
  handleSearchProduct,
  handleFavouriteChange,
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
              key={product.name}
              product={product}
              version={selectedVersionMap[product.name] || product.versionList[0]}
              handleFavouriteChange={handleFavouriteChange}
              handlePinChange={handlePinChange}
              handleVersionSelected={handleVersionSelected}
            />
          );
        })}
      </List>
    </>
  );
};

export default ProductList;
