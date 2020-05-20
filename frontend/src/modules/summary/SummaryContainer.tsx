import React, { Component, ReactNode } from 'react';
import { Grid, Card } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';

import fetchProducts from 'lib/services/FetchProducts';
import ProductListContainer from './productList/ProductListContainer';
import SummaryStyles from './styles/SummaryStyles';
import { setProductFavouriteOn, setProductFavouriteOff, pinABuild, unPinABuild } from 'lib/rest/Rest';
import Loading from 'modules/loading/Loading';
import Product, { updateProductPinnedBuildList } from 'models/Product';
import { LoggedInUser } from 'models/User';
import Version from 'models/Version';

interface Props extends WithStyles, WithTranslation {
  user: LoggedInUser;
}

interface State {
  productList: Product[] | null;
  loading: boolean;
}

class SummaryContainer extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { productList: null, loading: false };
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    fetchProducts().then(productList => {
      this.setState({
        productList: productList || null,
        loading: false,
      });
    });
  }

  changeFavouriteStatus(isFavourite: boolean, product: Product): Promise<any> {
    if (isFavourite) {
      return setProductFavouriteOff(product.name);
    }
    return setProductFavouriteOn(product.name);
  }

  handleFavouriteChange = (product: Product): void => {
    const isFavourite = product.favourite;
    const newProductList = this.state.productList;

    this.changeFavouriteStatus(isFavourite, product).then(response => {
      if (response && response.ok) {
        const newProduct = newProductList?.find(item => item.name === product.name);
        if (newProduct) {
          newProduct.favourite = !isFavourite;
          this.setState({
            productList: newProductList,
          });
        }
      }
    });
  };

  changePinStatus(product: Product, version: Version, build: string, isPinned: boolean): Promise<any> {
    if (isPinned) {
      return unPinABuild(product.name, version.major, version.minor, version.servicePack, build);
    }
    return pinABuild(product.name, version.major, version.minor, version.servicePack, build);
  }

  handlePinChange = (product: Product, version: Version, build: string, isPinned: boolean): void => {
    const newProductList = this.state.productList;

    this.changePinStatus(product, version, build, isPinned).then(response => {
      if (response.status === 200) {
        const newProduct = newProductList?.find(item => item.name === product.name);
        if (newProduct) {
          updateProductPinnedBuildList(newProduct, version, build, isPinned);
          this.setState({
            productList: newProductList,
          });
        }
      }
    });
  };

  render(): ReactNode {
    const { user, classes, t } = this.props;
    const { productList, loading } = this.state;

    if (!user) {
      return null;
    }

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

export default withTranslation()(withStyles(SummaryStyles)(SummaryContainer));
