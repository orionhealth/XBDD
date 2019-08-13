import React from "react";
import Navbar from "./modules/Navbar";
import "./Xbdd.css";
import Welcome from "./modules/Welcome";

class Xbdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = { summaryData: null, buildData: null };
  }

  render() {
    return (
      <div className="xbdd-app">
        <Navbar />
        <Welcome />
        {/* <Viewer /> */}
      </div>
    );
  }
}

export default Xbdd;
