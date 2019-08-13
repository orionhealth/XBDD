import React, { Component } from "react";
import ProductListContainer from "./ProductListContainer";
import welcomeStyles from "./WelcomeStyles"
import {withStyles} from "@material-ui/core/styles"

import { getSummaryOfReports, setProductFavouriteOn, setProductFavouriteOff } from "../lib/rest/Rest";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { summaryData: null, buildData: null };

    this.onFavouriteChange = this.onFavouriteChange.bind(this);
  }

  componentDidMount() {
    getSummaryOfReports().then(summaryData => this.setState({ summaryData }));
  }

  onFavouriteChange(product) {
    if(product.favourite) {
      setProductFavouriteOff(product.name).then(response => {
          if (response.status === 200) {
            getSummaryOfReports().then(summaryData => this.setState({ summaryData }));
          }
      });
    } else {
      setProductFavouriteOn(product.name).then(response => {
        if (response.status === 200) {
            getSummaryOfReports().then(summaryData => this.setState({ summaryData }));
          }
      });
    }
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

  render(){
    return (
      <ProductListContainer summaryData={this.state.summaryData} onFavouriteChange={this.onFavouriteChange}/>
    );
  }
}

export default withStyles(welcomeStyles) (Welcome);
