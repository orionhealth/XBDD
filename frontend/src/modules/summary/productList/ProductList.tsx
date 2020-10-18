import React, { FC, ChangeEvent } from 'react';
import { List, Typography, TextField, Grid, Box } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

import { useProductListStyles } from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';
import Product, { getVersionFromString } from 'models/Product';
import { useSelector } from 'react-redux';
import { RootStore } from 'rootReducer';

interface Props {
  list: Product[];
  title: string;
  handleSearchProduct(event: ChangeEvent<HTMLInputElement>): void;
}

const ProductList: FC<Props> = ({ list, title, handleSearchProduct }) => {
  const classes = useProductListStyles();
  const selectedVersionMap = useSelector((state: RootStore) => state.report.selectedVersion);

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
          const selectedVersion: string = selectedVersionMap[product.name];
          const version = selectedVersion ? getVersionFromString(product, selectedVersion) : product.versionList[0];
          if (!version) {
            return null;
          }
          return <ProductListItem key={product.name} product={product} version={version} />;
        })}
      </List>
    </>
  );
};

export default ProductList;
