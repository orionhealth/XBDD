import React, { Component } from "react";
import { Divider } from "@material-ui/core";
import FeatureSummary from "./FeatureSummary";
import ScenarioList from "./ScenarioList";

class FeatureReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedScenario: null };
  }

  render() {
    const { feature } = this.props;
    return (
      <>
        <FeatureSummary feature={feature} />
        <Divider />
        <ScenarioList scenarioList={feature.scenarios} />
      </>
    );
  }
}

export default FeatureReportContainer;
