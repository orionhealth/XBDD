import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Typography, Checkbox, Grid, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/styles";
import { featureListContainerStyles } from "./styles/FeatureListContainerStyles";
import FeatureFilterButtons from "./FeatureFilterButtons";
import ListViewFeatureList from "./ListViewFeatureList/ListViewFeatureList";
import TagList from "./TagViewFeatureList/TagList";
import FeatureList from "../../../models/FeatureList";
import { getFeatureListByTagData, getSimpleFeatureListData } from "../../../lib/rest/Rest";

class FeatureListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTagView: false,
      featureList: null,
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
      expandedTagsList: [],
    };
    this.handleViewSwitch = this.handleViewSwitch.bind(this);
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
  }

  componentDidMount() {
    const featureList = new FeatureList();
    const { product, version, build } = this.props;
    getFeatureListByTagData(product, version, build).then(data => {
      featureList.setFeatureListByTag(data);
      getSimpleFeatureListData(product, version, build).then(data => {
        featureList.setSimpleFeatureList(data);
        this.setState({ featureList });
      });
    });
  }

  handleViewSwitch() {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        isTagView: !prevState.isTagView,
      }));
  }

  handleFilterButtonClick(status) {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        selectedStatus: Object.assign({}, prevState.selectedStatus, {
          [status]: !prevState.selectedStatus[status],
        }),
      }));
  }

  handleTagSelect(tag) {
    if (this.state.expandedTagsList.includes(tag)) {
      const newExpandTagsList = [...this.state.expandedTagsList];
      const index = newExpandTagsList.indexOf(tag);
      newExpandTagsList.splice(index, 1);
      this.setState({ expandedTagsList: newExpandTagsList });
    } else {
      this.setState({ expandedTagsList: [...this.state.expandedTagsList, tag] });
    }
  }

  filterTags() {
    const tagList = this.state.featureList.tagList;

    return tagList.filter(
      tag =>
        (this.state.selectedStatus.passed && tag.containsPassed) ||
        (this.state.selectedStatus.failed && tag.containsFailed) ||
        (this.state.selectedStatus.undefined && tag.containsUndefined) ||
        (this.state.selectedStatus.skipped && tag.containsSkipped)
    );
  }

  renderFeatureList() {
    if (this.state.isTagView) {
      return (
        <TagList
          tagList={this.filterTags()}
          selectedStatus={this.state.selectedStatus}
          expandedTagsList={this.state.expandedTagsList}
          handleTagSelect={this.handleTagSelect}
        />
      );
    } else {
      return <ListViewFeatureList featureList={this.state.featureList.simpleFeatureList} selectedStatus={this.state.selectedStatus} />;
    }
  }

  render() {
    const { classes } = this.props;
    if (this.state.featureList) {
      return (
        <>
          <FeatureFilterButtons selectedStatus={this.state.selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
          <div className={classes.xbddTagListContainer}>
            <Grid container className={classes.featureListTitle}>
              <Grid item xs={5}>
                <Typography variant="h6">Features</Typography>
              </Grid>
              <Grid item xs={5} />
              <Grid item xs={2} className={classes.tagIcon}>
                <Tooltip title={this.state.isTagView ? "Switch to List View" : "Switch to Tag View"} placement="top">
                  <Checkbox
                    onChange={this.handleViewSwitch}
                    icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
                    checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
                    checked={this.state.isTagView}
                  />
                </Tooltip>
              </Grid>
            </Grid>
            {this.renderFeatureList()}
          </div>
        </>
      );
    }
    return null;
  }
}

FeatureListContainer.propTypes = {
  classes: PropTypes.shape({}),
};

export default withStyles(featureListContainerStyles)(FeatureListContainer);
