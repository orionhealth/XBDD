import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Typography, Checkbox, Tooltip, Box } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faUserTag, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/styles";
import { featureListContainerStyles } from "./styles/FeatureListContainerStyles";
import FeatureFilterButtons from "./FeatureFilterButtons";
import ListViewFeatureList from "./ListViewFeatureList/ListViewFeatureList";
import TagList from "./TagViewFeatureList/TagList";
import ConfirmationDialog from "../../utils/ConfirmationDialog";
import FeatureList from "../../../models/FeatureList";
import TagAssignmentPatch from "../../../models/TagAssignmentPatch";
import {
  getFeatureListByTagData,
  getSimpleFeatureListData,
  getTagAssignmentData,
  setTagAssignmentData,
  getIgnoredTags,
  setIgnoredTag,
} from "../../../lib/rest/Rest";

class FeatureListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warningArgs: null,
      isEditMode: false,
      isAssignedTagsView: false,
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
    this.handleEditModeSwitch = this.handleEditModeSwitch.bind(this);
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleTagAssigned = this.handleTagAssigned.bind(this);
    this.handleWarningShow = this.handleWarningShow.bind(this);
    this.handleWarningClosed = this.handleWarningClosed.bind(this);
    this.handleTagIgnore = this.handleTagIgnore.bind(this);
  }

  componentDidMount() {
    const featureList = new FeatureList();
    const { product, version, build } = this.props;
    Promise.all([
      getFeatureListByTagData(product, version, build),
      getSimpleFeatureListData(product, version, build),
      getTagAssignmentData(product, version, build),
      getIgnoredTags(product),
    ]).then(data => {
      featureList.setFeatureListByTag(data[0]);
      featureList.setSimpleFeatureList(data[1]);
      featureList.setUserForTags(data[2]);
      featureList.setIgnoredTags(data[3]);
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

  handleEditModeSwitch() {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        isEditMode: !prevState.isEditMode,
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

  handleTagIgnore(product, tagName) {
    setIgnoredTag(product, { tagName: tagName }).then(response => {
      if (!response || response.status !== 200) {
        this.setIgnoreStateForTag(tagName);
        this.props.handleErrorMessageDisplay();
      }
    });
    this.setIgnoreStateForTag(tagName);
  }

  setIgnoreStateForTag(tagName) {
    this.setState(prevState => {
      const newFeatureList = prevState.featureList.clone();
      newFeatureList.toggleIgnoreForTag(tagName);
      return Object.assign({}, prevState, {
        featureList: newFeatureList,
      });
    });
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
      <>
        <Tooltip title={this.state.isEditMode ? "Turn Edit Mode Off" : "Turn Edit Mode On"} placement="top">
          <Checkbox
            onChange={this.handleEditModeSwitch}
            icon={<FontAwesomeIcon icon={faUserSlash} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserSlash} className={classes.checkedIcon} />}
            checked={this.state.isEditMode}
          />
        </Tooltip>
        <Tooltip title={this.state.isAssignedTagsView ? "Show All Tags" : "Show Only Assigned Tags"} placement="top">
          <Checkbox
            onChange={this.handleTagsSwitch}
            icon={<FontAwesomeIcon icon={faUserTag} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserTag} className={classes.checkedIcon} />}
            checked={this.state.isAssignedTagsView}
          />
        </Tooltip>
      </>
    );
  }

  renderViewsSwithch(classes) {
    return (
      <Tooltip title={this.state.isTagView ? "Switch to List View" : "Switch to Tag View"} placement="top">
        <Checkbox
          onChange={this.handleViewSwitch}
          icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
          checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
          checked={this.state.isTagView}
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
          {this.renderViewsSwithch(classes)}
        </Box>
      </Box>
    );
  }

  renderFeatureList(userName, restId, selectedFeatureId, handleFeatureSelected) {
    if (this.state.isTagView) {
      return (
        <TagList
          userName={userName}
          isEditMode={this.state.isEditMode}
          isAssignedTagsView={this.state.isAssignedTagsView}
          tagList={this.filterTags(userName)}
          restId={restId}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={this.state.selectedStatus}
          expandedTagsList={this.state.expandedTagsList}
          handleTagSelect={this.handleTagSelect}
          handleFeatureSelected={handleFeatureSelected}
          handleTagAssigned={this.handleTagAssigned}
          handleWarningShow={this.handleWarningShow}
          handleTagIgnore={this.handleTagIgnore}
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
          <ConfirmationDialog
            open={!!this.state.warningArgs}
            title={"Warning!!"}
            msg={"Reassigning The Tag"}
            handleConfirmed={() => this.state.warningArgs && this.handleTagAssigned(...this.state.warningArgs)}
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
  product: PropTypes.string,
  version: PropTypes.string,
  build: PropTypes.string,
  userName: PropTypes.string,
  selectedFeatureId: PropTypes.string,
  handleErrorMessageDisplay: PropTypes.func.isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(featureListContainerStyles)(FeatureListContainer);
