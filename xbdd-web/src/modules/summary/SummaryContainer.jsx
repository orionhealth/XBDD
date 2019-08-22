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
    this.state = { productList: null };

    this.handleFavouriteChange = this.handleFavouriteChange.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
  }

  componentDidMount() {
    getSummaryOfReports().then(summaryData => {
      const productList = new ProductSummary(summaryData).productList;
      this.setState({
        productList: productList,
      });
    });
  }

  handleFavouriteChange(product) {
    const isFavourite = product.favourite;
    const newProductList = this.state.productList;

    (isFavourite ? setProductFavouriteOff(product.name) : setProductFavouriteOn(product.name)).then(response => {
      if (response.status === 200) {
        const newProduct = newProductList.find(item => item.name === product.name);
        newProduct.setFavouriteStatus(!isFavourite);
        this.setState({
          productList: newProductList,
        });
      }
    });
  }

  handlePinChange(event, product, version, build, isPinned) {
    const newProductList = this.state.productList;

    (isPinned
      ? unPinABuild(product.name, version.major, version.minor, version.servicePack, build)
      : pinABuild(product.name, version.major, version.minor, version.servicePack, build)
    ).then(response => {
      if (response.status === 200) {
        const newProduct = newProductList.find(item => item.name === product.name);
        newProduct.updatePinnedBuildList(version, build, isPinned);
        this.setState({
          productList: newProductList,
        });
      }
    });
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
                    title={"Product List"}
                    handleFavouriteChange={this.handleFavouriteChange}
                    handlePinChange={this.handlePinChange}
                  />
                </Card>
              </Grid>
              <Grid item xs={6} className={this.props.classes.productListContainer}>
                <Card raised>
                  <ProductListContainer
                    list={this.state.productList.filter(product => product.favourite)}
                    title={"Favourite"}
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
