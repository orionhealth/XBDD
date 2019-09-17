import React, { Component } from "react";
import {} from "@material-ui/core";
import FeatureSummary from "./FeatureSummary/FeatureSummary";
import ScenarioList from "./ScenarioList/ScenarioList";

class FeatureReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedScenarioIdList: [], hoveredStepId: null, anchor: null };

    this.handleScenarioClicked = this.handleScenarioClicked.bind(this);
    this.handleMouseEnterStep = this.handleMouseEnterStep.bind(this);
    this.handleMouseLeaveStep = this.handleMouseLeaveStep.bind(this);
    this.handleMoreButtonClicked = this.handleMoreButtonClicked.bind(this);
  }

  handleScenarioClicked(scenarioId) {
    if (this.state.expandedScenarioIdList.includes(scenarioId)) {
      const newExpandedScenarioIdList = [...this.state.expandedScenarioIdList];
      const index = newExpandedScenarioIdList.indexOf(scenarioId);
      newExpandedScenarioIdList.splice(index, 1);
      this.setState({ expandedScenarioIdList: newExpandedScenarioIdList });
    } else {
      this.setState({ expandedScenarioIdList: [...this.state.expandedScenarioIdList, scenarioId] });
    }
  }
  handleMouseEnterStep(hoveredStepId) {
    this.setState({ hoveredStepId: hoveredStepId });
  }
  handleMouseLeaveStep() {
    this.setState({ hoveredStepId: null, anchor: null });
  }

  handleMoreButtonClicked(event) {
    if (this.state.anchor) {
      this.setState({ anchor: null });
    } else {
      this.setState({ anchor: event.currentTarget });
    }
  }

  render() {
    const { feature, executionHistory, handleScenarioCommentChanged, handleStatusChange } = this.props;
    return (
      <>
        <FeatureSummary feature={feature} executionHistory={executionHistory} />
        <ScenarioList
          scenarioList={feature.scenarios}
          expandedScenarioIdList={this.state.expandedScenarioIdList}
          hoveredStepId={this.state.hoveredStepId}
          anchor={this.state.anchor}
          handleScenarioClicked={this.handleScenarioClicked}
          handleScenarioCommentChanged={handleScenarioCommentChanged}
          handleMouseEnterStep={this.handleMouseEnterStep}
          handleMouseLeaveStep={this.handleMouseLeaveStep}
          handleMoreButtonClicked={this.handleMoreButtonClicked}
          handleStatusChange={handleStatusChange}
        />
      </>
    );
  }
}

export default FeatureReportContainer;
