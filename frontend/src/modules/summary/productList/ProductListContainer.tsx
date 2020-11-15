import React, { FC, ChangeEvent, useState } from 'react';
import { List, Typography, TextField, Grid, Box, Card } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

import { useProductListStyles } from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';
import Product from 'models/Product';

interface Props {
  list: Product[];
  title: string;
}

const ProductListTitle: FC<{ title: string }> = ({ title }) => {
  const classes = useProductListStyles();

  return (
    <Box color="primary">
      <Typography variant="h5" className={classes.productListTitle}>
        {title}
      </Typography>
    </Box>
  );
};

const SearchBar: FC<{ searchHandler: (e: ChangeEvent<HTMLInputElement>) => void }> = ({ searchHandler }) => {
  const classes = useProductListStyles();

  return (
    <Grid container spacing={1} className={classes.searchBar}>
      <Grid item>
        <Search />
      </Grid>
      <Grid item>
        <TextField label="Search" onChange={searchHandler} />
      </Grid>
    </Grid>
  );
};

const ProductList: FC<{ productList: Product[] }> = ({ productList }) => {
  return (
    <List>
      {productList.map(product => (
        <ProductListItem key={product.name} product={product} />
      ))}
    </List>
  );
};

const ProductListContainer: FC<Props> = ({ list, title }) => {
  const [searchContent, setSearchContent] = useState('');

  const handleSearchProduct = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchContent(e.target.value);
  };

  const filteredList = searchContent ? list.filter(product => product.name.toLowerCase().includes(searchContent.toLowerCase())) : list;

  return (
    <Card raised>
      <ProductListTitle title={title} />
      <SearchBar searchHandler={handleSearchProduct} />
      <ProductList productList={filteredList} />
    </Card>
  );
};

export default ProductListContainer;
