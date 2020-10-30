import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { pinABuild, setProductFavouriteOff, setProductFavouriteOn, unPinABuild } from 'lib/rest/Rest';
import Product from 'models/Product';
import { RootStore, StoreDispatch } from 'rootReducer';
import fetchProducts from '../lib/services/FetchProducts';
import { getString } from 'models/Version';

export interface ReportIdentifier {
  product: string;
  version: string;
  build: string;
}

type ReportList = Product[];
type SelectedVersion = Record<string, string>;

type ReportState = {
  currentReportId: ReportIdentifier | null;
  productList: ReportList | null;
  selectedVersion: SelectedVersion | {};
};

type SelectedVersionChange = {
  product: string;
  version: string;
};

type FavouriteStatueChange = {
  product: string;
  isFavourite: boolean;
};

type PinStatueChange = {
  product: string;
  version: string;
  build: string;
  isPinned: boolean;
};

type UpdateReportAction = PayloadAction<ReportState>;
type UpdateReportIdAction = PayloadAction<ReportIdentifier>;
type UpdateProductListAction = PayloadAction<ReportList>;
type UpdateSelectedVersionAction = PayloadAction<SelectedVersionChange>;
type UpdateFavouriteStatusAction = PayloadAction<FavouriteStatueChange>;
type UpdatePinStatusAction = PayloadAction<PinStatueChange>;

const updateReportReducer: CaseReducer<ReportState, UpdateReportAction> = (state, action) => {
  return { ...state, ...action.payload };
};

const updateReportIdReducer: CaseReducer<ReportState, UpdateReportIdAction> = (state, action) => {
  const { product, version, build } = action.payload;
  const reportId = { product: product, version: version, build: build };
  state.currentReportId = reportId;
  return state;
};

const updateProductListReducer: CaseReducer<ReportState, UpdateProductListAction> = (state, action) => {
  state.productList = action.payload;
  return state;
};

const updateSelectedVersionReducer: CaseReducer<ReportState, UpdateSelectedVersionAction> = (state, action) => {
  const { product, version } = action.payload;
  state.selectedVersion[product] = version;
  return state;
};

const updateFavouriteStatusReducer: CaseReducer<ReportState, UpdateFavouriteStatusAction> = (state, action) => {
  const { product, isFavourite } = action.payload;
  const productList = state.productList;
  const productToUpdate = productList?.find(item => item.name === product);
  if (productToUpdate) {
    productToUpdate.favourite = !isFavourite;
  }
  return state;
};

const updatePinStatusReducer: CaseReducer<ReportState, UpdatePinStatusAction> = (state, action) => {
  const { product, version, build, isPinned } = action.payload;
  const productList = state.productList;
  const productToUpdate = productList?.find(item => item.name === product);
  const versionToUpdate = productToUpdate?.versionList.find(item => getString(item) === version);
  const buildToUpdate = versionToUpdate?.buildList.find(item => item.name === build);
  if (buildToUpdate) {
    buildToUpdate.isPinned = !isPinned;
  }
  return state;
};

const initialState: ReportState = { currentReportId: null, productList: null, selectedVersion: {} };

const { actions, reducer } = createSlice({
  name: 'Report',
  initialState,
  reducers: {
    updateReport: updateReportReducer,
    updateReportId: updateReportIdReducer,
    updateProductList: updateProductListReducer,
    updateSelectedVersion: updateSelectedVersionReducer,
    updateFavouriteStatus: updateFavouriteStatusReducer,
    updatePinStatus: updatePinStatusReducer,
  },
});

export const { updateReport, updateReportId, updateProductList, updateSelectedVersion, updateFavouriteStatus, updatePinStatus } = actions;

export const updateReportIdentifier = (product: string, version: string, build: string) => (dispatch: StoreDispatch): void => {
  dispatch(updateReportId({ product, version, build }));
};

export const fetchProductList = () => async (dispatch: StoreDispatch): Promise<void> => {
  const productList = await fetchProducts();
  dispatch(updateProductList(productList || []));
};

export const selectVersion = (product: string, version: string) => (dispatch: StoreDispatch): void => {
  dispatch(updateSelectedVersion({ product, version } || []));
};

const rollbackOnFail = (response: Response | void, dispatch: StoreDispatch, report: ReportState): void => {
  if (!response || !response.ok) {
    dispatch(updateReport(report));
  }
};

export const updateFavouriteStatusWithRollback = (product: string, isFavourite: boolean) => (
  dispatch: StoreDispatch,
  getState: () => RootStore
): void => {
  const state = getState();
  const user = state.user;

  if (user) {
    const setProductFavourite = isFavourite ? setProductFavouriteOff : setProductFavouriteOn;

    setProductFavourite(product).then(response => {
      rollbackOnFail(response, dispatch, state.report);
    });

    dispatch(updateFavouriteStatus({ product, isFavourite }));
  }
};

export const updatePinStatusWithRollback = (product: string, version: string, build: string, isPinned: boolean) => (
  dispatch: StoreDispatch,
  getState: () => RootStore
): void => {
  const state = getState();
  const user = state.user;

  if (user) {
    const setBuildPinStatus = isPinned ? unPinABuild : pinABuild;

    setBuildPinStatus(product, version, build).then(response => {
      rollbackOnFail(response, dispatch, state.report);
    });

    dispatch(updatePinStatus({ product, version, build, isPinned }));
  }
};

export default reducer;
