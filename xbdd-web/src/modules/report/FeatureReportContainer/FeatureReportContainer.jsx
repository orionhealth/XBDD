import React, { Component } from "react";
import {} from "@material-ui/core";
import FeatureSummary from "./FeatureSummary/FeatureSummary";
import ScenarioList from "./ScenarioList/ScenarioList";

class FeatureReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedScenarioList: [] };

    this.handleScenarioClicked = this.handleScenarioClicked.bind(this);
  }

  handleScenarioClicked(scenario) {
    if (this.state.expandedScenarioList.includes(scenario)) {
      const newExpandedScenarioList = [...this.state.expandedScenarioList];
      const index = newExpandedScenarioList.indexOf(scenario);
      newExpandedScenarioList.splice(index, 1);
      this.setState({ expandedScenarioList: newExpandedScenarioList });
    } else {
      this.setState({ expandedScenarioList: [...this.state.expandedScenarioList, scenario] });
    }
  }

  render() {
    const { feature, executionHistory, handleScenarioCommentChanged } = this.props;
    return (
      <>
        <FeatureSummary feature={feature} executionHistory={executionHistory} />
        <ScenarioList
          scenarioList={feature.scenarios}
          expandedScenarioList={this.state.expandedScenarioList}
          handleScenarioClicked={this.handleScenarioClicked}
          handleStepClicked={this.handleStepClicked}
          handleScenarioCommentChanged={handleScenarioCommentChanged}
        />
      </>
    );
  }
}

export default FeatureReportContainer;
