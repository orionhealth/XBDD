import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import FeatureSummary from './FeatureSummary/FeatureSummary';
import ScenarioList from './ScenarioList/ScenarioList';

class FeatureReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedScenarioIdList: [] };

    this.handleScenarioClicked = this.handleScenarioClicked.bind(this);
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

  render() {
    const { feature, executionHistory, handleScenarioCommentChanged, handleStatusChange, handleScreenshotClicked } = this.props;

    return (
      <>
        <FeatureSummary feature={feature} executionHistory={executionHistory} />
        <ScenarioList
          scenarioList={feature.scenarios}
          expandedScenarioIdList={this.state.expandedScenarioIdList}
          handleScenarioClicked={this.handleScenarioClicked}
          handleScenarioCommentChanged={handleScenarioCommentChanged}
          handleStatusChange={handleStatusChange}
          handleScreenshotClicked={handleScreenshotClicked}
        />
      </>
    );
  }
}

FeatureReportContainer.propTypes = {
  feature: PropTypes.shape({}),
  executionHistory: PropTypes.arrayOf(PropTypes.shape({})),
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleScreenshotClicked: PropTypes.func.isRequired,
};

export default FeatureReportContainer;
