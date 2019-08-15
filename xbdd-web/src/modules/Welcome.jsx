import React, { Component } from "react";
import ProductListContainer from "./ProductListContainer";
import { Grid, Card, Typography } from "@material-ui/core";
import welcomeStyles from "./WelcomeStyles";
import { withStyles } from "@material-ui/core/styles";

import { getSummaryOfReports, setProductFavouriteOn, setProductFavouriteOff } from "../lib/rest/Rest";
import ProductSummary from "../models/ProductSummary";

class Welcome extends Component {
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

  // Remove the duplicate product and filter by favourtite
  processList(productList, isFavouriteList) {
    const list = [];
    productList.forEach(element => {
      var flag = true;
      list.forEach(product => {
        if (product.name === element.name) {
          flag = false;
        }
      });
      if (flag) {
        if (!isFavouriteList) {
          list.push(Object.assign({}, element, { expanded: false }));
        } else {
          if (element.favourite) {
            list.push(Object.assign({}, element, { expanded: false }));
          }
        }
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

  // componentDidUpdate() {
  //   // console.debug(`State is ${JSON.stringify(this.state, null, 2)}`);
  // }

  // fetchAndStoreBuildData(product, version, build) {
  //   getBuild(product, version, build).then(buildData => this.setState({ buildData: new Report(buildData) }));
  // }

  // renderButton(product, version, build) {
  //   const text = `${product} v${version} build ${build}`;
  //   const onClick = () => this.fetchAndStoreBuildData(product, version, build);

  //   return (
  //     <button key={`${product}:${version}:${build}`} onClick={onClick}>
  //       {text}
  //     </button>
  //   );
  // }

  // renderBuildButtons(project) {
  //   const { product, major, minor, servicePack } = project.coordinates;
  //   const version = `${major}.${minor}.${servicePack}`;

  //   return project.builds.map(build => this.renderButton(product, version, build));
  // }

  render() {
    if (this.state.productList && this.state.favouriteList) {
      return (
        <Card>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h3" className={this.props.classes.title}>
                G'day Mate
              </Typography>
            </Grid>
            <Grid item xs={6} className={this.props.classes.productList}>
              <Card raised>
                <ProductListContainer
                  list={this.state.productList}
                  isFavouriteList={false}
                  handleFavouriteChange={this.handleFavouriteChange}
                />
              </Card>
            </Grid>
            <Grid item xs={6} className={this.props.classes.productList}>
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

export default withStyles(welcomeStyles)(Welcome);
