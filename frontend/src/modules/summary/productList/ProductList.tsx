import React, { FC, ChangeEvent, useState, ReactNode } from 'react';
import { List, Typography, TextField, Grid, Box, Card } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { useSelector } from 'react-redux';

import { useProductListStyles } from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';
import Product, { getVersionFromString } from 'models/Product';
import { RootStore } from 'rootReducer';

interface Props {
  list: Product[];
  title: string;
}

const ProductList: FC<Props> = ({ list, title }) => {
  const classes = useProductListStyles();
  const selectedVersionMap = useSelector((state: RootStore) => state.report.selectedVersion);
  const [searchContent, setSearchContent] = useState('');

  const handleSearchProduct = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchContent(event.target.value);
  };

  const filteredList = searchContent ? list.filter(product => product.name.toLowerCase().includes(searchContent.toLowerCase())) : list;

  const renderTitle = (): ReactNode => (
    <Box color="primary">
      <Typography variant="h5" className={classes.productListTitle}>
        {title}
      </Typography>
    </Box>
  );

  const renderSearchBar = (): ReactNode => (
    <Grid container spacing={1} className={classes.searchBar}>
      <Grid item>
        <Search />
      </Grid>
      <Grid item>
        <TextField label="Search" onChange={handleSearchProduct} />
      </Grid>
    </Grid>
  );

  const renderList = (): ReactNode => (
    <List>
      {filteredList.map(product => {
        const selectedVersion: string = selectedVersionMap[product.name];
        const version = selectedVersion ? getVersionFromString(product, selectedVersion) : product.versionList[0];
        if (!version) {
          return null;
        }
        return <ProductListItem key={product.name} product={product} version={version} />;
      })}
    </List>
  );

  if (!list) {
    return null;
  }

  return (
    <Card raised>
      {renderTitle()}
      {renderSearchBar()}
      {renderList()}
    </Card>
  );
};

export default ProductList;
