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

  handleBuildSelected(event, product, version, build) {
    this.setState({ productSelected: product, versionSelected: version, buildSelected: build });
  }

  render() {
    return (
      <div className="xbdd-app">
        <Navbar />
        {this.state.buildSelected ? (
          <ReportContainer product={this.state.productSelected} version={this.state.versionSelected} build={this.state.buildSelected} />
        ) : (
          <SummaryContainer handleBuildSelected={this.handleBuildSelected} />
        )}
      </div>
    );
  }
}

export default Xbdd;
