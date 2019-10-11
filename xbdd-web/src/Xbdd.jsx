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
      userName: null,
    };

    this.handleBuildSelected = this.handleBuildSelected.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    if (process.env.NODE_ENV === "development") {
      this.setState({ userName: "FX" });
    }
  }

  switchPage(buildSelected) {
    if (this.state.userName) {
      if (buildSelected) {
        return (
          <ReportContainer
            userName={this.state.userName}
            product={this.state.productSelected}
            version={this.state.versionSelected}
            build={this.state.buildSelected}
          />
        );
      } else {
        return <SummaryContainer handleBuildSelected={this.handleBuildSelected} />;
      }
    } else {
      return <div />;
    }
  }

  handleBuildSelected(product, version, build) {
    this.setState({ productSelected: product, versionSelected: version, buildSelected: build });
  }

  render() {
    return (
      <div className="xbdd-app">
        <Navbar login={this.login} />
        {this.switchPage(this.state.buildSelected)}
      </div>
    );
  }
}

export default Xbdd;
