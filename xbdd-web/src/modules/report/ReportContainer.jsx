import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card } from "@material-ui/core";
import FeatureListContainer from "./FeatureListContainer/FeatureListContainer";
import FeatureReportContainer from "./FeatureReportContainer/FeatureReportContainer";
import { getFeatureReport, getRollUpData } from "../../lib/rest/Rest";
import Feature from "../../models/Feature";
import Execution from "../../models/Execution";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
      executionHistory: null,
    };

    this.handleFeatureSelected = this.handleFeatureSelected.bind(this);
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

  render() {
    const { product, version, build } = this.props;
    if (true) {
      return (
        <>
          <Card>
            <Grid container>
              <Grid item xs={4} lg={3}>
                <FeatureListContainer
                  product={product}
                  version={version}
                  build={build}
                  handleFeatureSelected={this.handleFeatureSelected}
                />
              </Grid>
              <Grid item xs={8} lg={9}>
                {this.state.selectedFeature && this.state.executionHistory ? (
                  <FeatureReportContainer feature={this.state.selectedFeature} executionHistory={this.state.executionHistory} />
                ) : null}
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
