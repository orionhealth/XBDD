import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ProductListContainer from "./productList/ProductListContainer";
import SummaryStyles from "./styles/SummaryStyles";
import ProductSummary from "../../models/ProductSummary";
import { getSummaryOfReports, setProductFavouriteOn, setProductFavouriteOff } from "../../lib/rest/Rest";

class SummaryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { productList: null, favouriteList: null };

    this.handleFavouriteChange = this.handleFavouriteChange.bind(this);
  }

  componentDidMount() {
    getSummaryOfReports().then(summaryData => {
      const productList = new ProductSummary(summaryData).productList;
      this.setState({
        productList: this.processList(productList, false),
        favouriteList: this.processList(productList, true),
      });
    });
  }

  processList(productList, isFavouriteList) {
    const list = [];
    productList.forEach(element => {
      const hasBeenAdded = list.some(product => product.name === element.name);
      const shouldBeAdded = isFavouriteList ? !hasBeenAdded && element.favourite : !hasBeenAdded;
      if (shouldBeAdded) {
        list.push(element.clone());
      }
    });
    return list;
  }

  handleFavouriteChange(product) {
    const isFavourite = product.favourite;
    var newProductList = this.state.productList;

    (isFavourite ? setProductFavouriteOff(product.name) : setProductFavouriteOn(product.name)).then(response => {
      if (response.status === 200) {
        newProductList.forEach(item => {
          if (item.name === product.name) {
            item.favourite = !isFavourite;
          }
        });
        this.setState({
          productList: this.processList(newProductList, false),
          favouriteList: this.processList(newProductList, true),
        });
      }
    });
  }

  render() {
    if (this.state.productList && this.state.favouriteList) {
      return (
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
                />
              </Card>
            </Grid>
            <Grid item xs={6} className={this.props.classes.productListContainer}>
              <Card raised>
                <ProductListContainer
                  list={this.state.favouriteList}
                  isFavouriteList={true}
                  handleFavouriteChange={this.handleFavouriteChange}
                />
              </Card>
            </Grid>
          </Grid>
        </Card>
      );
    }
    return null;
  }
}

SummaryContainer.propTypes = {
  classes: PropTypes.shape({}),
};

export default withStyles(SummaryStyles)(SummaryContainer);
