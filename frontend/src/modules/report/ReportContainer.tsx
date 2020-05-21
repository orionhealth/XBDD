import React, { Component, ReactNode } from 'react';
import { Grid, Card } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import produce from 'immer';

import { getRollUpData, updateStepPatch, updateAllStepPatch, updateComments } from 'lib/rest/Rest';
import Feature from 'models/Feature';
import Execution, { createExecutionFromFetchedData } from 'models/Execution';
import { reportContainerStyles } from './styles/ReportContainerStyles';
import FeatureListContainer from './FeatureListContainer/FeatureListContainer';
import { calculateManualStatus, calculateFeatureStatus } from 'lib/StatusCalculator';
import ScenarioDisplay from './ScenarioDisplay/ScenarioDisplay';
import FeatureSummary from './FeatureSummary/FeatureSummary';
import fetchFeature from 'lib/services/FetchFeature';
import { LoggedInUser } from 'models/User';
import Scenario from 'models/Scenario';
import Status from 'models/Status';
import StatusChange from 'models/StatusChange';
import SimpleFeature from 'models/SimpleFeature';

interface Props extends WithStyles {
  user: LoggedInUser;
  productId: string;
  versionString: string;
  build: string;
}

interface State {
  selectedFeature?: Feature;
  executionHistory?: Execution[];
}

class ReportContainer extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateLastUpdated(): void {
    const { user } = this.props;
    this.setState(oldState =>
      produce(oldState, ({ selectedFeature }) => {
        if (selectedFeature) {
          selectedFeature.lastEditedOn = new Date();
          selectedFeature.lastEditedBy = user.display;
        }
      })
    );
  }

  handleFeatureSelected = (feature: SimpleFeature): void => {
    const { productId, versionString } = this.props;
    const { selectedFeature } = this.state;
    if (selectedFeature?.id !== feature.id) {
      fetchFeature(feature._id).then(newSelectedFeature => {
        if (newSelectedFeature) {
          getRollUpData(productId, versionString, feature.id).then(data => {
            if (data) {
              const executionHistory = data.rollup.map(build => build && createExecutionFromFetchedData(build)).filter(Boolean);
              this.setState({
                selectedFeature: newSelectedFeature,
                executionHistory,
              });
            }
          });
        }
      });
    }
  };

  updateScenariosComment(scenarios: Scenario[], scenarioId: string, label: string, content: string): Scenario[] {
    const newScenarios = [...scenarios];
    const newScenario = newScenarios.find(scenario => scenario.id === scenarioId);
    if (newScenario) {
      newScenario[label] = content;
    }
    return newScenarios;
  }

  setStateForComment(scenarioId: string, label: string, content: string): void {
    this.setState(current =>
      produce(current, draft => {
        const { selectedFeature } = draft;
        if (selectedFeature) {
          this.updateScenariosComment(selectedFeature.scenarios, scenarioId, label, content);
        }
      })
    );
  }

  handleCommentUpdate = (scenarioId: string, label: string, requestLabel: string, prevContent: string, newContent: string): void => {
    const { selectedFeature } = this.state;
    if (selectedFeature) {
      updateComments(selectedFeature._id, { scenarioId, label: requestLabel, content: newContent }).then(response => {
        if (!response || !response.ok) {
          this.setStateForComment(scenarioId, label, prevContent);
        }
      });
      this.setStateForComment(scenarioId, label, newContent);

      this.updateLastUpdated();
    }
  };

  updateExecutionHistory(executions: Execution[], status: Status): Execution[] {
    const { build } = this.props;
    const newExecutions = [...executions];
    const newExecution = newExecutions.find(execution => execution.build === build);

    if (newExecution) {
      newExecution.calculatedStatus = status;
    }

    return newExecutions;
  }

  processFailedResponse(response, scenarioId: string, statusChanges: StatusChange[]): void {
    if (!response || !response.ok) {
      this.setStateForStep(scenarioId, statusChanges);
    } else {
      this.updateLastUpdated();
    }
  }

  updateStepsStatus(scenario: Scenario, statusChanges: StatusChange[]): void {
    statusChanges.forEach(change => {
      let found = false;
      if (scenario.backgroundSteps) {
        const newBackgroundStep = scenario.backgroundSteps.find(step => step.id === change.stepId);
        if (newBackgroundStep) {
          found = true;
          newBackgroundStep.manualStatus = change.status;
        }
      }
      if (!found) {
        const newStep = scenario.steps.find(step => step.id === change.stepId);
        if (newStep) {
          newStep.manualStatus = change.status;
        }
      }
    });
    scenario.calculatedStatus = calculateManualStatus(scenario);
  }

  setStateForStep(scenarioId: string, statusChanges: StatusChange[]): void {
    this.setState(prevState =>
      produce(prevState, draft => {
        const { selectedFeature } = draft;

        if (selectedFeature) {
          const prevCalculatedStatus = selectedFeature.calculatedStatus;
          const scenario = selectedFeature.scenarios.find(scenario => scenario.id === scenarioId);

          if (scenario) {
            this.updateStepsStatus(scenario, statusChanges);
            selectedFeature.calculatedStatus = calculateFeatureStatus(selectedFeature);

            if (prevCalculatedStatus !== selectedFeature.calculatedStatus) {
              draft.executionHistory = this.updateExecutionHistory(draft.executionHistory || [], selectedFeature.calculatedStatus);
            }
          }
        }
      })
    );
  }

  handleStatusChange = (scenarioId: string, prevStatusChanges: StatusChange[], newStatusChanges: StatusChange[]): void => {
    const { selectedFeature } = this.state;
    const firstStepId = newStatusChanges[0].stepId;
    const firstStatus = newStatusChanges[0].status;
    if (selectedFeature) {
      if (newStatusChanges.length === 1) {
        updateStepPatch(selectedFeature._id, { scenarioId, line: firstStepId, status: firstStatus }).then(response =>
          this.processFailedResponse(response, scenarioId, prevStatusChanges)
        );
      } else {
        updateAllStepPatch(selectedFeature._id, { scenarioId, line: null, status: firstStatus }).then(response =>
          this.processFailedResponse(response, scenarioId, prevStatusChanges)
        );
      }
      this.setStateForStep(scenarioId, newStatusChanges);
    }
  };

  render(): ReactNode {
    const { user, productId, versionString, build, classes } = this.props;
    const { selectedFeature, executionHistory } = this.state;

    if (!user) {
      return null;
    }

    return (
      <>
        <Card elevation={0}>
          <Grid container>
            <Grid item xs={4} lg={4}>
              <FeatureListContainer
                user={user}
                productId={productId}
                versionString={versionString}
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

export default withStyles(reportContainerStyles)(ReportContainer);
