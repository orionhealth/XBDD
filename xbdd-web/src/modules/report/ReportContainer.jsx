import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card } from "@material-ui/core";
import FeatureListContainer from "./FeatureListContainer/FeatureListContainer";
import FeatureReportContainer from "./FeatureReportContainer/FeatureReportContainer";
import { getFeatureReport } from "../../lib/rest/Rest";
import Feature from "../../models/Feature";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
    };

    this.handleFeatureSelected = this.handleFeatureSelected.bind(this);
  }

  handleFeatureSelected(featureId) {
    getFeatureReport(featureId).then(data =>
      this.setState({
        selectedFeature: new Feature(data),
      }));
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
                {this.state.selectedFeature ? <FeatureReportContainer feature={this.state.selectedFeature} /> : null}
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
