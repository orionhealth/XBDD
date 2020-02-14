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
      userNameInput: null,
      userName: null,
    };

    this.handleUserNameInput = this.handleUserNameInput.bind(this);
    this.handleBuildSelected = this.handleBuildSelected.bind(this);
    this.login = this.login.bind(this);
  }

  handleUserNameInput(event) {
    this.setState({ userNameInput: event.target.value });
  }

  login() {
    this.setState({ userName: this.state.userNameInput });
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
        <Navbar
          userName={this.state.userName}
          userNameInput={this.state.userNameInput}
          handleUserNameInput={this.handleUserNameInput}
          login={this.login}
        />
        {this.switchPage(this.state.buildSelected)}
      </div>
    );
  }
}

export default Xbdd;
