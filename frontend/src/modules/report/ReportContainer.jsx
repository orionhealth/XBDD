import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import produce from 'immer';

import { getFeatureReport, getRollUpData, updateStepPatch, updateAllStepPatch, updateComments } from 'lib/rest/Rest';
import { createFeatureFromFetchedData, cloneFeature } from 'models/Feature';
import { createExecutionFromFetchedData } from 'models/Execution';
import { reportContainerStyles } from './styles/ReportContainerStyles';
import FeatureListContainer from './FeatureListContainer/FeatureListContainer';
import { calculateManualStatus, calculateFeatureStatus } from 'lib/StatusCalculator';
import ScenarioDisplay from './ScenarioDisplay/ScenarioDisplay';
import FeatureSummary from './FeatureSummary/FeatureSummary';

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
      executionHistory: null,
    };
  }

  updatedLastUpdated() {
    this.setState(oldState =>
      produce(oldState, draft => {
        draft.selectedFeature.lastEditedOn = new Date();
      })
    );
  }

  handleFeatureSelected = feature => {
    const { selectedFeature } = this.state;
    if (selectedFeature?.id !== feature.id) {
      getFeatureReport(feature._id).then(data => {
        if (data) {
          const selectedFeature = createFeatureFromFetchedData(data);
          getRollUpData(this.props.product, this.props.version, feature.id).then(data => {
            if (data) {
              const executionHistory = data.rollup.map(build => build && createExecutionFromFetchedData(build)).filter(Boolean);
              this.setState({
                selectedFeature,
                executionHistory,
              });
            }
          });
        }
      });
    }
  };

  updateScenariosComment(scenarios, scenarioId, label, content) {
    const newScenarios = [...scenarios];
    const newScenario = newScenarios.find(scenario => scenario.id === scenarioId);
    newScenario[label] = content;
    return newScenarios;
  }

  setStateForComment(scenarioId, label, content) {
    this.setState(prevState => {
      const newSelectedFeature = cloneFeature(prevState.selectedFeature);
      this.updateScenariosComment(newSelectedFeature.scenarios, scenarioId, label, content);
      return Object.assign({}, prevState, {
        selectedFeature: newSelectedFeature,
      });
    });
  }

  handleCommentUpdate = (scenarioId, label, requestLabel, prevContent, newContent) => {
    const { selectedFeature } = this.state;
    updateComments(selectedFeature._id, { scenarioId, label: requestLabel, content: newContent }).then(response => {
      if (!response || !response.ok) {
        this.setStateForComment(scenarioId, label, prevContent);
      }
    });
    this.setStateForComment(scenarioId, label, newContent);

    this.updatedLastUpdated();
  };

  updateExecutionHistory(executions, status) {
    const { build } = this.props;
    const newExecutions = [...executions];
    const newExecution = newExecutions.find(execution => execution.build === build);

    newExecution.calculatedStatus = status;
    return newExecutions;
  }

  processFailedResponse(response, scenarioId, prevStatusMap) {
    if (!response || !response.ok) {
      this.setStateForStep(scenarioId, prevStatusMap);
    } else {
      this.updatedLastUpdated();
    }
  }

  updateStepsStatus(scenario, statusMap) {
    statusMap.forEach(change => {
      var found = false;
      if (scenario.backgroundSteps) {
        const newBackgroundStep = scenario.backgroundSteps.find(step => step.id === change.stepId);
        if (newBackgroundStep) {
          found = true;
          newBackgroundStep.manualStatus = change.status;
        }
      }
      if (!found) {
        const newStep = scenario.steps.find(step => step.id === change.stepId);
        newStep.manualStatus = change.status;
      }
    });
    scenario.calculatedStatus = calculateManualStatus(scenario);
  }

  setStateForStep(scenarioId, statusMap) {
    this.setState(prevState => {
      const newFeature = cloneFeature(prevState.selectedFeature);
      const prevCalculatedStatus = newFeature.calculatedStatus;
      const scenario = newFeature.scenarios.find(scenario => scenario.id === scenarioId);
      this.updateStepsStatus(scenario, statusMap);
      newFeature.calculatedStatus = calculateFeatureStatus(newFeature);
      if (prevCalculatedStatus !== newFeature.calculatedStatus) {
        const newExecutionHistory = this.updateExecutionHistory(prevState.executionHistory, newFeature.calculatedStatus);
        return Object.assign({}, prevState, {
          selectedFeature: newFeature,
          executionHistory: newExecutionHistory,
        });
      }
      return Object.assign({}, prevState, {
        selectedFeature: newFeature,
      });
    });
  }

  handleStatusChange = (scenarioId, prevStatusMap, newStatusMap) => {
    const { selectedFeature } = this.state;
    const firstStepId = newStatusMap[0].stepId;
    const firstStatus = newStatusMap[0].status;
    if (newStatusMap.length === 1) {
      updateStepPatch(selectedFeature._id, { scenarioId, line: firstStepId, status: firstStatus }).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    } else {
      updateAllStepPatch(selectedFeature._id, { scenarioId, line: null, status: firstStatus }).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    }
    this.setStateForStep(scenarioId, newStatusMap);
  };

  render() {
    const { product, version, build, classes } = this.props;
    const { selectedFeature, executionHistory } = this.state;
    return (
      <>
        <Card elevation={0}>
          <Grid container>
            <Grid item xs={4} lg={4}>
              <FeatureListContainer
                product={product}
                version={version}
                build={build}
                selectedFeatureId={selectedFeature?._id}
                handleFeatureSelected={this.handleFeatureSelected}
              />
            </Grid>
            <Grid item xs={8} lg={8}>
              {selectedFeature && executionHistory && (
                <div className={classes.scenarioList}>
                  <FeatureSummary feature={selectedFeature} executionHistory={executionHistory} />
                  {selectedFeature.scenarios.map(scenario => (
                    <ScenarioDisplay
                      key={scenario.id}
                      scenario={scenario}
                      handleCommentUpdate={this.handleCommentUpdate}
                      handleStatusChange={this.handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </Grid>
          </Grid>
        </Card>
      </>
    );
  }
}

ReportContainer.propTypes = {
  product: PropTypes.string,
  version: PropTypes.string,
  build: PropTypes.string,
  classes: PropTypes.shape({}),
};

export default withStyles(reportContainerStyles)(ReportContainer);
