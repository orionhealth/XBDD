import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Xbdd from './Xbdd';
import registerServiceWorker from "./utils/registerServiceWorker";

ReactDOM.render(<Xbdd />, document.getElementById("root"));
registerServiceWorker();
