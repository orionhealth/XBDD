import { combineReducers } from "redux";

import xbddReducer from "./xbddReducer";

const rootReducer = combineReducers({
  app: xbddReducer,
});

export default rootReducer;
