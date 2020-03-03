import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import ProductListContainer from './productList/ProductListContainer';
import SummaryStyles from './styles/SummaryStyles';
import { getSummaryOfReports, setProductFavouriteOn, setProductFavouriteOff, pinABuild, unPinABuild } from 'lib/rest/Rest';
import Loading from 'modules/loading/Loading';
import { updateProductPinnedBuildList } from 'models/Product';
import { createProductsFromFetchedData } from 'models/ProductSummary';

class SummaryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { productList: null, loading: false };
  }

  componentDidMount() {
    this.setState({ loading: true });
    getSummaryOfReports().then(summaryData => {
      if (summaryData) {
        const productList = createProductsFromFetchedData(summaryData);
        this.setState({
          productList,
        });
      }
      this.setState({ loading: false });
    });
  }

  changeFavouriteStatus(isFavourite, product) {
    if (isFavourite) {
      return setProductFavouriteOff(product.name);
    }
    return setProductFavouriteOn(product.name);
  }

  handleFavouriteChange = product => {
    const isFavourite = product.favourite;
    const newProductList = this.state.productList;

    this.changeFavouriteStatus(isFavourite, product).then(response => {
      if (response && response.ok) {
        const newProduct = newProductList.find(item => item.name === product.name);
        newProduct.favourite = !isFavourite;
        this.setState({
          productList: newProductList,
        });
      }
    });
  };

  changePinStatus(product, version, build, isPinned) {
    if (isPinned) {
      return unPinABuild(product.name, version.major, version.minor, version.servicePack, build);
    }
    return pinABuild(product.name, version.major, version.minor, version.servicePack, build);
  }

  handlePinChange = (product, version, build, isPinned) => {
    const newProductList = this.state.productList;

    this.changePinStatus(product, version, build, isPinned).then(response => {
      if (response.status === 200) {
        const newProduct = newProductList.find(item => item.name === product.name);
        updateProductPinnedBuildList(newProduct, version, build, isPinned);
        this.setState({
          productList: newProductList,
        });
      }
    });
  };

  render() {
    const { classes, t } = this.props;
    const { productList, loading } = this.state;

    return (
      <>
        <Loading loading={loading} />
        <Card elevation={0}>
          <Grid container>
            <Grid item xs={6} className={classes.productListContainer}>
              {productList && (
                <Card raised>
                  <ProductListContainer
                    list={productList}
                    title={t('summary.productList')}
                    handleFavouriteChange={this.handleFavouriteChange}
                    handlePinChange={this.handlePinChange}
                  />
                </Card>
              )}
            </Grid>
            <Grid item xs={6} className={classes.productListContainer}>
              {productList && (
                <Card raised>
                  <ProductListContainer
                    list={productList.filter(product => product.favourite)}
                    title={t('summary.favourites')}
                    handleFavouriteChange={this.handleFavouriteChange}
                    handlePinChange={this.handlePinChange}
                  />
                </Card>
              )}
            </Grid>
          </Grid>
        </Card>
      </>
    );
  }
}

SummaryContainer.propTypes = {
  classes: PropTypes.shape({}),
};

export default withTranslation()(withStyles(SummaryStyles)(SummaryContainer));
