import React from "react";
import "./Xbdd.css";
import Navbar from "./modules/navbar/Navbar";
import SummaryContainer from "./modules/summary/SummaryContainer";
import ReportContainer from "./modules/report/ReportContainer";

class Xbdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productSelected: null,
      versionSelected: null,
      buildSelected: null,
    };

    this.handleBuildSelected = this.handleBuildSelected.bind(this);
  }

  switchPage(buildSelected) {
    if (buildSelected) {
      return <ReportContainer product={this.state.productSelected} version={this.state.versionSelected} build={this.state.buildSelected} />;
    } else {
      return <SummaryContainer handleBuildSelected={this.handleBuildSelected} />;
    }
  }

  handleBuildSelected(product, version, build) {
    this.setState({ productSelected: product, versionSelected: version, buildSelected: build });
  }

  render() {
    return (
      <div className="xbdd-app">
        <Navbar />
        {this.switchPage(this.state.buildSelected)}
      </div>
    );
  }
}

export default Xbdd;
