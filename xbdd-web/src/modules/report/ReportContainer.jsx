import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { reportContainerStyles } from "./styles/ReportContainerStyles";
import FeatureListContainer from "./FeatureListContainer/FeatureListContainer";
import FeatureReportContainer from "./FeatureReportContainer/FeatureReportContainer";
import { getFeatureReport, getRollUpData, updateStepPatch, updateAllStepPatch } from "../../lib/rest/Rest";
import Feature from "../../models/Feature";
import Execution from "../../models/Execution";
import Patch from "../../models/Patch";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
      executionHistory: null,
      isNetworkError: false,
    };

    this.handleFeatureSelected = this.handleFeatureSelected.bind(this);
    this.handleScenarioCommentChanged = this.handleScenarioCommentChanged.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  handleFeatureSelected(feature) {
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

  updateScenariosComment(scenarios, scenarioId, comment, commentContent) {
    const newScenarios = [...scenarios];
    const newScenario = newScenarios.find(scenario => scenario.id === scenarioId);
    newScenario[comment] = commentContent;
    return newScenarios;
  }

  handleScenarioCommentChanged(id, comment, event) {
    const commentContent = event.target.value;
    this.setState(prevState => {
      const newSelectedFeature = prevState.selectedFeature.clone();
      this.updateScenariosComment(newSelectedFeature.scenarios, id, comment, commentContent);
      return Object.assign({}, prevState, {
        selectedFeature: newSelectedFeature,
      });
    });
  }

  updateScenarioStepsStatus(scenario, stepId, status) {
    var found = false;
    if (scenario.backgroundSteps) {
      const newBackgroundStep = scenario.backgroundSteps.find(step => step.id === stepId);
      if (newBackgroundStep) {
        found = true;
        newBackgroundStep.manualStatus = status;
      }
    }
    if (!found) {
      const newStep = scenario.steps.find(step => step.id === stepId);
      newStep.manualStatus = status;
    }
  }

  updateAllSteps(scenario, status) {
    if (scenario.backgroundSteps) {
      scenario.backgroundSteps.forEach(step => (step.manualStatus = status));
    }
    if (scenario.steps) {
      scenario.steps.forEach(step => (step.manualStatus = status));
    }
  }

  updateScenarios(scenarios, scenarioId, stepId, status) {
    const newScenarios = [...scenarios];
    const newScenario = newScenarios.find(scenario => scenario.id === scenarioId);
    if (stepId) {
      this.updateScenarioStepsStatus(newScenario, stepId, status);
      newScenario.calculateStatus();
    } else {
      this.updateAllSteps(newScenario, status);
      newScenario.calculatedStatus = status;
    }
    return newScenarios;
  }

  updateExecutionHistory(executions, status) {
    const newExecutions = [...executions];
    const newExecution = newExecutions.find(execution => execution.build === this.props.build);

    newExecution.calculatedStatus = status;
    return newExecutions;
  }

  processFailedResponse(response, backupSelectedFeature, backupExecutionHistory) {
    if (response.status !== 200) {
      this.setState({
        selectedFeature: backupSelectedFeature,
        executionHistory: backupExecutionHistory,
        isNetworkError: true,
      });
      setTimeout(() => {
        this.setState({ isNetworkError: false });
      }, 4000);
    }
  }

  handleStatusChange(scenarioId, stepId, status) {
    const featureId = this.state.selectedFeature._id;
    const backupSelectedFeature = this.state.selectedFeature.clone();
    const backupExecutionHistory = this.state.executionHistory.map(execution => execution.clone());
    if (stepId) {
      updateStepPatch(featureId, new Patch(scenarioId, stepId, status)).then(response =>
        this.processFailedResponse(response, backupSelectedFeature, backupExecutionHistory));
    } else {
      updateAllStepPatch(featureId, new Patch(scenarioId, null, status)).then(response =>
        this.processFailedResponse(response, backupSelectedFeature, backupExecutionHistory));
    }
    this.setState(prevState => {
      const newFeature = prevState.selectedFeature.clone();
      const prevCalculatedStatus = newFeature.calculatedStatus;
      newFeature.scenarios = this.updateScenarios(prevState.selectedFeature.scenarios, scenarioId, stepId, status);
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

  render() {
    const { product, version, build, classes } = this.props;
    return (
      <>
        {this.state.isNetworkError ? <Card className={classes.errorMessageBox}>Network Error!</Card> : null}
        <Card>
          <Grid container>
            <Grid item xs={4} lg={3}>
              <FeatureListContainer
                product={product}
                version={version}
                build={build}
                selectedFeatureId={this.state.selectedFeature ? this.state.selectedFeature._id : null}
                handleFeatureSelected={this.handleFeatureSelected}
              />
            </Grid>
            <Grid item xs={8} lg={9}>
              {this.state.selectedFeature && this.state.executionHistory ? (
                <FeatureReportContainer
                  feature={this.state.selectedFeature}
                  executionHistory={this.state.executionHistory}
                  hoveredStepId={this.state.hoveredStepId}
                  handleScenarioCommentChanged={this.handleScenarioCommentChanged}
                  handleStatusChange={this.handleStatusChange}
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
