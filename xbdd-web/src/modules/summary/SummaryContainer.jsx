import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ProductListContainer from "./productList/ProductListContainer";
import SummaryStyles from "./styles/SummaryStyles";
import ProductSummary from "../../models/ProductSummary";
import { getSummaryOfReports, setProductFavouriteOn, setProductFavouriteOff, pinABuild, unPinABuild } from "../../lib/rest/Rest";

class SummaryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { productList: null, favouriteList: null };

    this.handleFavouriteChange = this.handleFavouriteChange.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
  }

  componentDidMount() {
    getSummaryOfReports().then(summaryData => {
      const productList = new ProductSummary(summaryData).productList;
      this.setState({
        productList: productList.map(product => product.clone()).sort(this.compareList),
        favouriteList: productList
          .filter(product => product.favourite)
          .map(product => product.clone())
          .sort(this.compareList),
      });
    });
  }

  // processList(productList, isFavouriteList) {
  //   const list = [];
  //   productList.forEach(product => {
  //     const hasBeenAdded = list.some(element => product.name === element.name);
  //     const shouldBeAdded = isFavouriteList ? !hasBeenAdded && product.favourite : !hasBeenAdded;
  //     if (shouldBeAdded) {
  //       list.push(product.clone());
  //     }
  //   });
  //   return list;
  // }

  compareList(a, b) {
    return a.name > b.name ? 1 : -1;
  }

  handleFavouriteChange(product) {
    const isFavourite = product.favourite;
    var newProductList = this.state.productList.map(product => product.clone());
    //var newFavouriteList = this.state.favouriteList.map(product => product.clone());

    (isFavourite ? setProductFavouriteOff(product.name) : setProductFavouriteOn(product.name)).then(response => {
      if (response.status === 200) {
        newProductList.forEach(item => {
          if (item.name === product.name) {
            item.favourite = !isFavourite;
          }
        });
        // newFavouriteList.forEach(item => {
        //   if (item.name === product.name) {
        //     item.favourite = !isFavourite;
        //   }
        // });
        // if (!newFavouriteList.some(fav => fav.name === product.name)) {
        //   const newFav = product.clone();
        //   newFav.expanded = false;
        //   newFav.favourite = true;
        //   newFavouriteList.push(newFav);
        // }
        // this.setState({
        //   productList: newProductList.sort(this.compareList),
        //   favouriteList: newFavouriteList.filter(product => product.favourite).sort(this.compareList),
        // });
        this.setState({
          productList: newProductList.sort(this.compareList),
        });
      }
    });
  }

  handlePinChange(event, product, build, isPinned, version) {
    var newProductList = this.state.productList.map(product => product.clone());
    //var newFavouriteList = this.state.favouriteList.map(product => product.clone());
    (isPinned
      ? unPinABuild(product.name, version.major, version.minor, version.servicePack, build)
      : pinABuild(product.name, version.major, version.minor, version.servicePack, build)
    ).then(response => {
      if (response.status === 200) {
        var newProduct = newProductList.find(item => item.name === product.name);
        newProduct.updateBuildPinStatus(build, version, isPinned);
        this.setState({
          productList: newProductList,
        });
        //var newFavouriteProduct = newFavouriteList.find(item => item.name === product.name);
        //newFavouriteProduct.updateBuildPinStatus(build, version, isPinned);
      }
    });

    // this.setState({
    //   productList: newProductList,
    //   favouriteList: newFavouriteList.filter(product => product.favourite),
    // });
  }

  render() {
    if (this.state.productList) {
      return (
        <>
          <Card>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h3" className={this.props.classes.summaryTitle}>
                  G'day Mate
                </Typography>
              </Grid>
              <Grid item xs={6} className={this.props.classes.productListContainer}>
                <Card raised>
                  <ProductListContainer
                    list={this.state.productList}
                    isFavouriteList={false}
                    handleFavouriteChange={this.handleFavouriteChange}
                    handlePinChange={this.handlePinChange}
                  />
                </Card>
              </Grid>
              <Grid item xs={6} className={this.props.classes.productListContainer}>
                <Card raised>
                  <ProductListContainer
                    list={this.state.productList.filter(product => product.favourite)}
                    isFavouriteList={true}
                    handleFavouriteChange={this.handleFavouriteChange}
                    handlePinChange={this.handlePinChange}
                  />
                </Card>
              </Grid>
            </Grid>
          </Card>
        </>
      );
    }
    return null;
  }
}

SummaryContainer.propTypes = {
  classes: PropTypes.shape({}),
};

export default withStyles(SummaryStyles)(SummaryContainer);
