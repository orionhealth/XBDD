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
      isNetworkError: false,
    };

    this.handleFeatureSelected = this.handleFeatureSelected.bind(this);
    this.handleScenarioCommentChanged = this.handleScenarioCommentChanged.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleErrorMessageDisplay = this.handleErrorMessageDisplay.bind(this);
    this.handleScreenshotClicked = this.handleScreenshotClicked.bind(this);
    this.handleDialogClosed = this.handleDialogClosed.bind(this);
  }

  handleFeatureSelected(feature) {
    if (!this.state.selectedFeature || this.state.selectedFeature.id !== feature.id) {
      getFeatureReport(feature._id).then(data => {
        const selectedFeature = new Feature(data);
        getRollUpData(this.props.product, this.props.version, feature.id).then(data => {
          const executionHistory = data.rollup.map(build => new Execution(build));
          this.setState({
            selectedFeature,
            executionHistory,
          });
        });
      });
    }
  }

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

  handleScenarioCommentChanged(scenarioId, label, requestLabel, prevContent, newContent) {
    const featureId = this.state.selectedFeature._id;
    updateComments(featureId, new InputFieldPatch(scenarioId, requestLabel, newContent)).then(response => {
      if (!response || response.status !== 200) {
        this.setState({ isNetworkError: true });
        this.setStateForComment(scenarioId, label, prevContent);
        setTimeout(() => {
          this.setState({ isNetworkError: false });
        }, 4000);
      }
    });
    this.setStateForComment(scenarioId, label, newContent);
  }

  updateExecutionHistory(executions, status) {
    const newExecutions = [...executions];
    const newExecution = newExecutions.find(execution => execution.build === this.props.build);

    newExecution.calculatedStatus = status;
    return newExecutions;
  }

  handleErrorMessageDisplay() {
    this.setState({ isNetworkError: true });
    setTimeout(() => {
      this.setState({ isNetworkError: false });
    }, 4000);
  }

  processFailedResponse(response, scenarioId, prevStatusMap) {
    if (!response || response.status !== 200) {
      this.setStateForStep(scenarioId, prevStatusMap);
      this.handleErrorMessageDisplay();
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

  handleStatusChange(scenarioId, prevStatusMap, newStatusMap) {
    const featureId = this.state.selectedFeature._id;
    const firstStepId = newStatusMap[0].stepId;
    const firstStatus = newStatusMap[0].status;
    if (newStatusMap.length === 1) {
      updateStepPatch(featureId, new StepStatusPatch(scenarioId, firstStepId, firstStatus)).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    } else {
      updateAllStepPatch(featureId, new StepStatusPatch(scenarioId, null, firstStatus)).then(response =>
        this.processFailedResponse(response, scenarioId, prevStatusMap)
      );
    }
    this.setStateForStep(scenarioId, newStatusMap);
  }

  handleScreenshotClicked(content) {
    this.setState({ screenshotDialogContent: content });
  }

  handleDialogClosed() {
    this.setState({ screenshotDialogContent: null });
  }

  render() {
    const { product, version, build, classes } = this.props;
    return (
      <>
        {this.state.isNetworkError ? <Card className={classes.errorMessageBox}>Network Error!</Card> : null}
        <Card elevation={0}>
          <SimpleDialog
            open={!!this.state.screenshotDialogContent}
            title="Full Size Screenshot"
            content={this.state.screenshotDialogContent}
            handleClosed={this.handleDialogClosed}
          />
          <Grid container>
            <Grid item xs={4} lg={4}>
              <FeatureListContainer
                product={product}
                version={version}
                build={build}
                selectedFeatureId={this.state.selectedFeature ? this.state.selectedFeature._id : null}
                handleFeatureSelected={this.handleFeatureSelected}
                handleErrorMessageDisplay={this.handleErrorMessageDisplay}
              />
            </Grid>
            <Grid item xs={8} lg={8}>
              {this.state.selectedFeature && this.state.executionHistory ? (
                <FeatureReportContainer
                  feature={this.state.selectedFeature}
                  executionHistory={this.state.executionHistory}
                  hoveredStepId={this.state.hoveredStepId}
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
