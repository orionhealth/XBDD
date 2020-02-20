import React, { Component } from "react";
import { PropTypes } from "prop-types";
import FeatureSummary from "./FeatureSummary/FeatureSummary";
import ScenarioList from "./ScenarioList/ScenarioList";
import Feature from "models/Feature";
import Execution from "models/Execution";

class FeatureReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedScenarioIdList: [], hoveredStepId: null, anchor: null };

    this.handleScenarioClicked = this.handleScenarioClicked.bind(this);
    this.handleStepHovered = this.handleStepHovered.bind(this);
    this.handleStepNotHovered = this.handleStepNotHovered.bind(this);
    this.handleMoreButtonHovered = this.handleMoreButtonHovered.bind(this);
    this.handleMoreButtonNotHovered = this.handleMoreButtonNotHovered.bind(this);
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

  handleStepHovered(hoveredStepId) {
    this.setState({ hoveredStepId: hoveredStepId });
  }

  handleStepNotHovered() {
    this.setState({ hoveredStepId: null, anchor: null });
  }

  handleMoreButtonHovered(event) {
    this.setState({ anchor: event.currentTarget });
  }

  handleMoreButtonNotHovered() {
    this.setState({ anchor: null });
  }

  render() {
    const { feature, executionHistory, handleScenarioCommentChanged, handleStatusChange, handleScreenshotClicked } = this.props;

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
          handleStepHovered={this.handleStepHovered}
          handleStepNotHovered={this.handleStepNotHovered}
          handleMoreButtonHovered={this.handleMoreButtonHovered}
          handleMoreButtonNotHovered={this.handleMoreButtonNotHovered}
          handleStatusChange={handleStatusChange}
          handleScreenshotClicked={handleScreenshotClicked}
        />
      </>
    );
  }
}

FeatureReportContainer.propTypes = {
  feature: PropTypes.instanceOf(Feature),
  executionHistory: PropTypes.arrayOf(PropTypes.instanceOf(Execution)),
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleScreenshotClicked: PropTypes.func.isRequired,
};

export default FeatureReportContainer;
