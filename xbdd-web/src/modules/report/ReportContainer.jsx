import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Card } from "@material-ui/core";
import TagListContainer from "./tag-list/TagListContainer";
import Report from "../../models/Report";
import { getBuildReport } from "../../lib/rest/Rest";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { report: null };
  }

  componentDidMount() {
    getBuildReport(this.props.product, this.props.version, this.props.build).then(data => {
      this.setState({
        report: new Report(data),
      });
    });
  }

  render() {
    if (this.state.report) {
      const tagList = this.state.report.tagList;

      return (
        <>
          <Card>
            <Grid container>
              <Grid item xs={3}>
                <Card raised>
                  <TagListContainer tagList={tagList} />
                </Card>
              </Grid>
              <Grid item xs={9}>
                <Card raised>
                  <div style={{ height: "calc(100vh - 82px)" }}>report</div>
                </Card>
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
