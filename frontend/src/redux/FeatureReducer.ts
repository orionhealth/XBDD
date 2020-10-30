import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import Execution, { createExecutionFromFetchedData } from './../models/Execution';
import { getRollUpData, updateComment, updateStepPatch, updateAllStepPatch } from 'lib/rest/Rest';
import { StoreDispatch, RootStore } from 'rootReducer';
import Feature, { SimpleFeature } from 'models/Feature';
import fetchFeature from 'lib/services/FetchFeature';
import { User } from 'models/User';
import { calculateManualStatus, calculateFeatureStatus } from 'lib/StatusCalculator';
import Status from 'models/Status';
import Tag from 'models/Tag';
import fetchSimpleFeaturesByTags from 'lib/services/FetchSimpleFeaturesByTags';
import fetchSimpleFeatures from 'lib/services/FetchSimpleFeatures';

interface SelectedFeature {
  selected: Feature | null;
  executionHistory: Execution[] | null;
}

interface FeatureIndexes {
  byTag: Tag[] | null;
  byId: SimpleFeature[] | null;
}

type FeatureState = FeatureIndexes & SelectedFeature;

interface IndexStatusUpdate {
  feature: Feature;
  status: Status;
}

interface CommentUpdateDetails {
  scenarioId: string;
  label: string;
  content: string;
  user: User;
}

interface StepStatusChange {
  stepId: number;
  status: Status;
  scenarioId: string;
  build: string;
  user: User;
}

interface ScenarioStatusChange {
  status: Status;
  scenarioId: string;
  build: string;
  user: User;
}

type SaveIndexesAction = PayloadAction<FeatureIndexes>;
type SaveFeatureAndHistoryAction = PayloadAction<SelectedFeature>;
type CommentUpdateAction = PayloadAction<CommentUpdateDetails>;
type LastUpdatedUpdateAction = PayloadAction<User>;
type StepStatusChangeAction = PayloadAction<StepStatusChange>;
type ScenarioStatusChangeAction = PayloadAction<ScenarioStatusChange>;

const featureIndexReducer: CaseReducer<FeatureState, SaveIndexesAction> = (state, action) => {
  return { ...state, ...action.payload };
};

const saveFeatureAndHistoryReducer: CaseReducer<FeatureState, SaveFeatureAndHistoryAction> = (state, action) => {
  return { ...state, ...action.payload };
};

const updateMetadata = (featureState: FeatureState, user: User, build?: string): void => {
  const { selected, executionHistory } = featureState;
  if (selected && executionHistory) {
    selected.lastEditedOn = new Date();
    selected.lastEditedBy = user.display;
    const history = build && executionHistory.find(ex => ex.build === build);
    if (history) {
      history.calculatedStatus = selected.calculatedStatus;
      history.statusLastEditedBy = selected.lastEditedBy;
    }
  }
};

const updateFeatureStatus = (state: FeatureState, feature: Feature): void => {
  const { byId, byTag } = state;

  feature.calculatedStatus = calculateFeatureStatus(feature);

  if (byId) {
    for (const simpleFeature of byId) {
      if (simpleFeature._id === feature._id) {
        simpleFeature.calculatedStatus = feature.calculatedStatus;
      }
    }
  }

  if (byTag) {
    for (const simpleFeature of byTag.flatMap(tag => tag.features)) {
      if (simpleFeature._id === feature._id) {
        simpleFeature.calculatedStatus = feature.calculatedStatus;
      }
    }
  }
};

const updateScenarioCommentReducer: CaseReducer<FeatureState, CommentUpdateAction> = (state, action) => {
  const { scenarioId, label, content, user } = action.payload;
  const scenario = state.selected?.scenarios.find(scenario => scenario.id === scenarioId);
  if (scenario) {
    scenario[label] = content;
    updateMetadata(state, user);
    return state;
  }
};

const stepStatusChangeReducer: CaseReducer<FeatureState, StepStatusChangeAction> = (state, action) => {
  const { scenarioId, stepId, status, build } = action.payload;
  const feature = state.selected;
  const scenario = feature?.scenarios.find(scenario => scenario.id === scenarioId);

  if (feature && scenario) {
    const step = [...scenario.backgroundSteps, ...scenario.steps].find(step => step.id === stepId);

    if (step) {
      step.manualStatus = status;
      scenario.calculatedStatus = calculateManualStatus(scenario);
      updateFeatureStatus(state, feature);
      updateMetadata(state, action.payload.user, build);
      return state;
    }
  }
};

const scenarioStatusChangeReducer: CaseReducer<FeatureState, ScenarioStatusChangeAction> = (state, action) => {
  const { scenarioId, status, build, user } = action.payload;
  const feature = state.selected;
  const scenario = feature?.scenarios.find(scenario => scenario.id === scenarioId);

  if (feature && scenario) {
    [...scenario.backgroundSteps, ...scenario.steps].forEach(step => {
      step.manualStatus = status;
    });

    scenario.calculatedStatus = status;
    updateFeatureStatus(state, feature);
    updateMetadata(state, user, build);
    return state;
  }
};

const initialState: FeatureState = {
  byId: null,
  byTag: null,
  selected: null,
  executionHistory: null,
};

const resetFeatureStateReducer: CaseReducer = () => {
  return initialState;
};

const { actions, reducer } = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    saveIndexes: featureIndexReducer,
    saveFeatureAndHistory: saveFeatureAndHistoryReducer,
    updateScenarioComment: updateScenarioCommentReducer,
    stepStatusChange: stepStatusChangeReducer,
    scenarioStatusChange: scenarioStatusChangeReducer,
    resetFeatureState: resetFeatureStateReducer,
  },
});

export const {
  saveIndexes,
  saveFeatureAndHistory,
  updateScenarioComment,
  stepStatusChange,
  scenarioStatusChange,
  resetFeatureState,
} = actions;

export const fetchIndexes = () => async (dispatch: StoreDispatch, getState: () => RootStore): Promise<void> => {
  const state = getState();
  const reportIdentifier = state.report.currentReportId;
  if (reportIdentifier) {
    const { product, version, build } = reportIdentifier;
    const [byTag, byId] = await Promise.all([
      fetchSimpleFeaturesByTags(product, version, build),
      fetchSimpleFeatures(product, version, build),
    ]);
    dispatch(saveIndexes({ byId: byId || null, byTag: byTag || null }));
  }
};

export const selectFeature = (featureId: string) => async (dispatch: StoreDispatch, getState: () => RootStore): Promise<void> => {
  const state = getState();
  const reportIdentifier = state.report.currentReportId;
  if (reportIdentifier) {
    const { product, version, build } = reportIdentifier;
    const selected = await fetchFeature(product, version, build, featureId);

    if (selected) {
      const rollUp = await getRollUpData(product, version, featureId);
      if (rollUp) {
        const executionHistory = rollUp.rollup.map(build => build && createExecutionFromFetchedData(build)).filter(Boolean);
        dispatch(saveFeatureAndHistory({ selected, executionHistory }));
      }
    }
  }
};

const rollbackOnFail = (response: any, dispatch: StoreDispatch, featureState: FeatureState): void => {
  if (!response || !response.ok) {
    dispatch(saveFeatureAndHistory(featureState));
  }
};

export const updateCommentWithRollback = (scenarioId: string, label: string, requestLabel: string, content: string) => (
  dispatch: StoreDispatch,
  getState: () => RootStore
): void => {
  const state = getState();
  const selectedFeature = state.feature.selected;
  const user = state.user;
  const reportIdentifier = state.report.currentReportId;

  if (reportIdentifier && selectedFeature && user) {
    const { product, version, build } = reportIdentifier;
    updateComment(product, version, build, selectedFeature.id, { scenarioId, label: requestLabel, content }).then(response => {
      rollbackOnFail(response, dispatch, state.feature);
    });

    dispatch(updateScenarioComment({ scenarioId, label, content, user }));
  }
};

export const updateStepStatusWithRollback = (scenarioId: string, stepId: number, status: Status) => (
  dispatch: StoreDispatch,
  getState: () => RootStore
): void => {
  const state = getState();
  const selectedFeature = state.feature.selected;
  const user = state.user;
  const reportIdentifier = state.report.currentReportId;

  if (selectedFeature && reportIdentifier && user) {
    const { product, version, build } = reportIdentifier;
    updateStepPatch(product, version, build, selectedFeature.id, { scenarioId, line: stepId, status: status }).then(response => {
      rollbackOnFail(response, dispatch, state.feature);
    });

    dispatch(stepStatusChange({ stepId, status, scenarioId, user, build }));
  }
};

export const updateScenarioStatusWithRollback = (scenarioId: string, status: Status) => (
  dispatch: StoreDispatch,
  getState: () => RootStore
): void => {
  const state = getState();
  const selectedFeature = state.feature.selected;
  const user = state.user;
  const reportIdentifier = state.report.currentReportId;

  if (selectedFeature && reportIdentifier && user) {
    const { product, version, build } = reportIdentifier;
    updateAllStepPatch(product, version, build, selectedFeature.id, { scenarioId, status }).then(response => {
      rollbackOnFail(response, dispatch, state.feature);
    });

    dispatch(scenarioStatusChange({ status, scenarioId, user, build }));
  }
};

export default reducer;
