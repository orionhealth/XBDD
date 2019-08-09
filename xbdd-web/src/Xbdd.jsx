import React from "react";
import Navbar from "./modules/Navbar";
import Viewer from "./modules/Viewer"
import "./Xbdd.css";
import { getSummaryOfReports, getBuild } from "./lib/rest/Rest";
import Report from "./models/Report";
import Welcome from "./modules/Welcome";

class Xbdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = { summaryData: null, buildData: null };
    this.renderBuildButtons = this.renderBuildButtons.bind(this);
  }

  componentDidMount() {
    getSummaryOfReports().then(summaryData => this.setState({ summaryData }));
  }

  componentDidUpdate() {
    // console.debug(`State is ${JSON.stringify(this.state, null, 2)}`);
  }

  fetchAndStoreBuildData(product, version, build) {
    getBuild(product, version, build).then(buildData => this.setState({ buildData: new Report(buildData) }));
  }

  renderButton(product, version, build) {
    const text = `${product} v${version} build ${build}`;
    const onClick = () => this.fetchAndStoreBuildData(product, version, build);

    return (
      <button key={`${product}:${version}:${build}`} onClick={onClick}>
        {text}
      </button>
    );
  }

  renderBuildButtons(project) {
    const { product, major, minor, servicePack } = project.coordinates;
    const version = `${major}.${minor}.${servicePack}`;

    return project.builds.map(build => this.renderButton(product, version, build));
  }

  renderProjectLinks() {
    if (!this.state.summaryData) {
      return null;
    }

    return this.state.summaryData.map(this.renderBuildButtons);
  }

  render() {
    return (
      <div className="xbdd-app">
        <Navbar />
        <Welcome summaryData={this.state.summaryData}/>
        {/* <Viewer /> */}
        {/* {this.renderProjectLinks()} */}
      </div>
    );
  }
}

export default Xbdd;
