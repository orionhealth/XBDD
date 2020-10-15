import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { StoreDispatch } from 'rootReducer';

interface Report {
  product: string;
  version: string;
  build: string;
}

type ReportState = Report;

type UpdateReportAction = PayloadAction<Report>;

const updateReportReducer: CaseReducer<ReportState, UpdateReportAction> = (state, action) => {
  state.product = action.payload.product;
  state.version = action.payload.version;
  state.build = action.payload.build;
  return state;
};

const initialState: ReportState = {
  product: '',
  version: '',
  build: '',
};

const resetReportStateReducer: CaseReducer = () => {
  return initialState;
};

const { actions, reducer } = createSlice({
  name: 'Report',
  initialState,
  reducers: {
    updateReport: updateReportReducer,
    resetReport: resetReportStateReducer,
  },
});

export const { updateReport, resetReport } = actions;

export const updateReportIdentifier = (product: string, version: string, build: string) => (dispatch: StoreDispatch): void => {
  dispatch(updateReport({ product, version, build }));
};

export default reducer;
