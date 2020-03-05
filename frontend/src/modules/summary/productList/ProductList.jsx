import React from 'react';
import PropTypes from 'prop-types';
import { List, Typography, TextField, Grid, Box } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import ProductListStyles from './styles/ProductListStyles';
import ProductListItem from './ProductListItem';

const ProductList = props => {
  const {
    list,
    title,
    expandedProductsList,
    expandedBuildList,
    selectedVersionList,
    handleSearchProduct,
    handleFavouriteChange,
    handleProductClicked,
    handleVersionSelected,
    handlePinChange,
    handleBuildListExpanded,
    classes,
  } = props;

  if (!props.list) {
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
          <TextField label="Search" onChange={e => handleSearchProduct(e)} />
        </Grid>
      </Grid>

      <List>
        {list.map(product => {
          return (
            <ProductListItem
              product={product}
              expandedProductsList={expandedProductsList}
              expandedBuildList={expandedBuildList}
              selectedVersionList={selectedVersionList}
              key={product.name}
              handleFavouriteChange={handleFavouriteChange}
              handleProductClicked={handleProductClicked}
              handleVersionSelected={handleVersionSelected}
              handlePinChange={handlePinChange}
              handleBuildListExpanded={handleBuildListExpanded}
            />
          );
        })}
      </List>
    </>
  );
};

ProductList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  expandedProductsList: PropTypes.arrayOf(PropTypes.string),
  expandedBuildList: PropTypes.arrayOf(PropTypes.string),
  selectedVersionList: PropTypes.shape({}),
  handleSearchProduct: PropTypes.func.isRequired,
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  handleBuildListExpanded: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};
export default withStyles(ProductListStyles)(ProductList);
