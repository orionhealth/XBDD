import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card } from "@material-ui/core";
import FeatureListContainer from "./FeatureListContainer/FeatureListContainer";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { report: null };
  }

  componentDidMount() {
    // Fetch data for report or stat
  }

  render() {
    if (true) {
      return (
        <>
          <Card>
            <Grid container>
              <Grid item xs={3}>
                <FeatureListContainer product={this.props.product} version={this.props.version} build={this.props.build} />
              </Grid>
              <Grid item xs={9}>
                <div style={{ height: "calc(100vh - 82px)" }}>report</div>
              </Grid>
            </Grid>
          </Card>
        </>
      );
    }
    return null;
  }
}

ReportContainer.propTypes = {
  product: PropTypes.string,
  version: PropTypes.string,
  build: PropTypes.string,
};

export default ReportContainer;
