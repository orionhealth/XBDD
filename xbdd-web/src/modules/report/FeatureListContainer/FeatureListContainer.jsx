import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Typography, Checkbox, Tooltip, Box } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faUserTag } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/styles";
import { featureListContainerStyles } from "./styles/FeatureListContainerStyles";
import FeatureFilterButtons from "./FeatureFilterButtons";
import ListViewFeatureList from "./ListViewFeatureList/ListViewFeatureList";
import TagList from "./TagViewFeatureList/TagList";
import WarningDialog from "./WarningDialog";
import FeatureList from "../../../models/FeatureList";
import TagAssignmentPatch from "../../../models/TagAssignmentPatch";
import { getFeatureListByTagData, getSimpleFeatureListData, getTagAssignmentData, setTagAssignmentData } from "../../../lib/rest/Rest";

class FeatureListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warningArgs: null,
      isAssignedTagsView: true,
      isTagView: true,
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
    this.handleTagsSwitch = this.handleTagsSwitch.bind(this);
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleTagAssigned = this.handleTagAssigned.bind(this);
    this.handleWarningShow = this.handleWarningShow.bind(this);
    this.handleWarningClosed = this.handleWarningClosed.bind(this);
  }

  componentDidMount() {
    const featureList = new FeatureList();
    const { product, version, build } = this.props;
    Promise.all([
      getFeatureListByTagData(product, version, build),
      getSimpleFeatureListData(product, version, build),
      getTagAssignmentData(product, version, build),
    ]).then(data => {
      featureList.setFeatureListByTag(data[0]);
      featureList.setSimpleFeatureList(data[1]);
      featureList.setUserForTags(data[2]);
      this.setState({ featureList });
    });
  }

  handleViewSwitch() {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        isTagView: !prevState.isTagView,
      }));
  }

  handleTagsSwitch() {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        isAssignedTagsView: !prevState.isAssignedTagsView,
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

  setStateForTagUser(tag, userName) {
    this.setState(prevState => {
      const newFeatureList = prevState.featureList.clone();
      newFeatureList.setUserForTag(tag, userName);
      return Object.assign({}, prevState, {
        featureList: newFeatureList,
        warningArgs: null,
      });
    });
  }

  handleTagAssigned(restId, tag, prevUserName, userName) {
    var newUserName = userName;
    if (prevUserName === userName) {
      newUserName = null;
    }
    setTagAssignmentData(restId, new TagAssignmentPatch(tag, newUserName)).then(response => {
      if (!response || response.status !== 200) {
        this.setStateForTagUser(tag, prevUserName);
        this.props.handleErrorMessageDisplay();
      }
    });
    this.setStateForTagUser(tag, newUserName);
  }

  handleWarningShow(...args) {
    this.setState({ warningArgs: args });
  }

  handleWarningClosed() {
    this.setState({ warningArgs: null });
  }

  filterTags(userName) {
    var newTagList = this.state.featureList.tagList;

    if (this.state.isAssignedTagsView) {
      newTagList = newTagList.filter(tag => tag.userName === userName);
    }

    return newTagList.filter(
      tag =>
        (this.state.selectedStatus.passed && tag.containsPassed) ||
        (this.state.selectedStatus.failed && tag.containsFailed) ||
        (this.state.selectedStatus.undefined && tag.containsUndefined) ||
        (this.state.selectedStatus.skipped && tag.containsSkipped)
    );
  }

  renderAssignedTagsSwitch(classes) {
    return (
      <Tooltip title={this.state.isAssignedTagsView ? "Show All Tags" : "Show Only Assigned Tags"} placement="top">
        <Checkbox
          onChange={this.handleTagsSwitch}
          icon={<FontAwesomeIcon icon={faUserTag} className={classes.unCheckedIcon} />}
          checkedIcon={<FontAwesomeIcon icon={faUserTag} className={classes.checkedIcon} />}
          checked={this.state.isAssignedTagsView}
        />
      </Tooltip>
    );
  }

  renderFeatureListTitle(classes) {
    return (
      <Box className={classes.featureListTitle}>
        <Box p={1} flexGrow={1} className={null}>
          <Typography variant="h5">Features</Typography>
        </Box>
        <Box>
          {this.state.isTagView ? this.renderAssignedTagsSwitch(classes) : null}

          <Tooltip title={this.state.isTagView ? "Switch to List View" : "Switch to Tag View"} placement="top">
            <Checkbox
              onChange={this.handleViewSwitch}
              icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
              checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
              checked={this.state.isTagView}
            />
          </Tooltip>
        </Box>
      </Box>
    );
  }

  renderFeatureList(userName, restId, selectedFeatureId, handleFeatureSelected) {
    if (this.state.isTagView) {
      return (
        <TagList
          userName={userName}
          tagList={this.filterTags(userName)}
          restId={restId}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={this.state.selectedStatus}
          expandedTagsList={this.state.expandedTagsList}
          handleTagSelect={this.handleTagSelect}
          handleFeatureSelected={handleFeatureSelected}
          handleTagAssigned={this.handleTagAssigned}
          handleWarningShow={this.handleWarningShow}
        />
      );
    } else {
      return (
        <ListViewFeatureList
          selectedFeatureId={selectedFeatureId}
          featureList={this.state.featureList.simpleFeatureList}
          selectedStatus={this.state.selectedStatus}
          handleFeatureSelected={handleFeatureSelected}
        />
      );
    }
  }

  render() {
    const { product, version, build, userName, selectedFeatureId, handleFeatureSelected, classes } = this.props;
    const restId = `${product}/${version}/${build}`;
    if (this.state.featureList) {
      return (
        <>
          <WarningDialog
            open={!!this.state.warningArgs}
            msg={"Overriding"}
            handler={() => this.handleTagAssigned(...this.state.warningArgs)}
            handleClosed={this.handleWarningClosed}
          />
          <FeatureFilterButtons selectedStatus={this.state.selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
          <div className={classes.xbddTagListContainer}>
            {this.renderFeatureListTitle(classes)}
            {this.renderFeatureList(userName, restId, selectedFeatureId, handleFeatureSelected)}
          </div>
        </>
      );
    }
    return null;
  }
}

FeatureListContainer.propTypes = {
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(featureListContainerStyles)(FeatureListContainer);
