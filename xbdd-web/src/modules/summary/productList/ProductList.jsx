import React from "react";
import PropTypes from "prop-types";
import { List, Typography, TextField, Grid } from "@material-ui/core";
import Search from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import ProductListStyles from "./styles/ProductListStyles";
import ProductListItem from "./ProductListItem";
import Product from "../../../models/Product";

const ProductList = props => {
  const {
    list,
    title,
    expandedProductsList,
    selectedVersionList,
    handleSearchProduct,
    handleFavouriteChange,
    handleProductClicked,
    handleVersionSelected,
    handlePinChange,
    handleBuildSelected,
    classes,
  } = props;

  if (!props.list) {
    return null;
  }
  return (
    <>
      <Typography variant="h5" className={classes.productListTitle}>
        {title}
      </Typography>
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
              selectedVersionList={selectedVersionList}
              key={product.name}
              handleFavouriteChange={handleFavouriteChange}
              handleProductClicked={handleProductClicked}
              handleVersionSelected={handleVersionSelected}
              handlePinChange={handlePinChange}
              handleBuildSelected={handleBuildSelected}
            />
          );
        })}
      </List>
    </>
  );
};

ProductList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.instanceOf(Product)),
  title: PropTypes.string,
  expandedProductsList: PropTypes.arrayOf(PropTypes.string),
  selectedVersionList: PropTypes.shape({}),
  handleSearchProduct: PropTypes.func.isRequired,
  handleFavouriteChange: PropTypes.func.isRequired,
  handleProductClicked: PropTypes.func.isRequired,
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  handleBuildSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};
export default withStyles(ProductListStyles)(ProductList);
