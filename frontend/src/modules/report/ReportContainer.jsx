import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { getFeatureReport, getRollUpData, updateStepPatch, updateAllStepPatch, updateComments } from 'lib/rest/Rest';
import Feature from 'models/Feature';
import SimpleDialog from 'modules/utils/SimpleDialog';
import Execution from 'models/Execution';
import StepStatusPatch from 'models/StepStatusPatch';
import { reportContainerStyles } from './styles/ReportContainerStyles';
import FeatureListContainer from './FeatureListContainer/FeatureListContainer';
import FeatureReportContainer from './FeatureReportContainer/FeatureReportContainer';
import InputFieldPatch from 'models/InputFieldPatch';
import { calculateManualStatus } from 'lib/ScenarioStatusCalculator';

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenshotDialogContent: null,
      selectedFeature: null,
      executionHistory: null,
    };
  }

  handleFeatureSelected = feature => {
    const { selectedFeature } = this.state;
    if (selectedFeature?.id !== feature.id) {
      getFeatureReport(feature._id).then(data => {
        if (data) {
          const selectedFeature = new Feature(data);
          getRollUpData(this.props.product, this.props.version, feature.id).then(data => {
            if (data) {
              const executionHistory = data.rollup.map(build => build && new Execution(build)).filter(Boolean);
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
      const newSelectedFeature = prevState.selectedFeature.clone();
      this.updateScenariosComment(newSelectedFeature.scenarios, scenarioId, label, content);
      return Object.assign({}, prevState, {
        selectedFeature: newSelectedFeature,
      });
    });
  }

  handleScenarioCommentChanged = (scenarioId, label, requestLabel, prevContent, newContent) => {
    const { selectedFeature } = this.state;
    updateComments(selectedFeature._id, new InputFieldPatch(scenarioId, requestLabel, newContent)).then(response => {
      if (!response || !response.ok) {
        this.setStateForComment(scenarioId, label, prevContent);
      }
    });
    this.setStateForComment(scenarioId, label, newContent);
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
      const newFeature = prevState.selectedFeature.clone();
      const prevCalculatedStatus = newFeature.calculatedStatus;
      const scenario = newFeature.scenarios.find(scenario => scenario.id === scenarioId);
      this.updateStepsStatus(scenario, statusMap);
      newFeature.calculateStatus();
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
      updateStepPatch(selectedFeature._id, new StepStatusPatch(scenarioId, firstStepId, firstStatus)).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    } else {
      updateAllStepPatch(selectedFeature._id, new StepStatusPatch(scenarioId, null, firstStatus)).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    }
    this.setStateForStep(scenarioId, newStatusMap);
  };

  handleScreenshotClicked = content => {
    this.setState({ screenshotDialogContent: content });
  };

  handleDialogClosed = () => {
    this.setState({ screenshotDialogContent: null });
  };

  render() {
    const { product, version, build } = this.props;
    const { screenshotDialogContent, selectedFeature, executionHistory, hoveredStepId } = this.state;
    return (
      <>
        <Card elevation={0}>
          <SimpleDialog
            open={!!screenshotDialogContent}
            title="Full Size Screenshot"
            content={screenshotDialogContent}
            handleClosed={this.handleDialogClosed}
          />
          <Grid container>
            <Grid item xs={4} lg={4}>
              <FeatureListContainer
                product={product}
                version={version}
                build={build}
                selectedFeatureId={selectedFeature?.id}
                handleFeatureSelected={this.handleFeatureSelected}
              />
            </Grid>
            <Grid item xs={8} lg={8}>
              {selectedFeature && executionHistory ? (
                <FeatureReportContainer
                  feature={selectedFeature}
                  executionHistory={executionHistory}
                  hoveredStepId={hoveredStepId}
                  handleScenarioCommentChanged={this.handleScenarioCommentChanged}
                  handleStatusChange={this.handleStatusChange}
                  handleScreenshotClicked={this.handleScreenshotClicked}
                />
              ) : null}
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
