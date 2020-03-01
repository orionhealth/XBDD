import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Typography, Checkbox, Tooltip, Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faUserTag, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';

import ConfirmationDialog from 'modules/utils/ConfirmationDialog';
import FeatureList from 'models/FeatureList';
import TagAssignmentPatch from 'models/TagAssignmentPatch';
import {
  getFeatureListByTagData,
  getSimpleFeatureListData,
  getTagAssignmentData,
  setTagAssignmentData,
  getIgnoredTags,
  setIgnoredTag,
} from 'lib/rest/Rest';
import { featureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';
import Loading from 'modules/loading/Loading';

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
      loading: false,
    };
  }

  componentDidMount() {
    const featureList = new FeatureList();
    const { product, version, build } = this.props;
    this.setState({ loading: true });
    Promise.all([
      getFeatureListByTagData(product, version, build),
      getSimpleFeatureListData(product, version, build),
      getTagAssignmentData(product, version, build),
      getIgnoredTags(product),
    ])
      .then(data => {
        featureList.setFeatureListByTag(data[0]);
        featureList.setSimpleFeatureList(data[1]);
        featureList.setUserFromTagAssignments(data[2]);
        featureList.setIgnoredTags(data[3]);
        this.setState({ featureList });
      })
      .finally(() => this.setState({ loading: false }));
  }

  handleViewSwitch = () => {
    this.setState(prevState => ({ ...prevState, isTagView: !prevState.isTagView }));
  };

  handleTagsSwitch = () => {
    this.setState(prevState => ({ ...prevState, isAssignedTagsView: !prevState.isAssignedTagsView }));
  };

  handleEditModeSwitch = () => {
    this.setState(prevState => ({ ...prevState, isEditMode: !prevState.isEditMode }));
  };

  handleFilterButtonClick = status => {
    this.setState(prevState => ({
      ...prevState,
      selectedStatus: { ...prevState.selectedStatus, [status]: !prevState.selectedStatus[status] },
    }));
  };

  handleTagSelect = tag => {
    const { expandedTagsList } = this.state;
    if (expandedTagsList.includes(tag)) {
      const newExpandTagsList = [...expandedTagsList];
      const index = newExpandTagsList.indexOf(tag);
      newExpandTagsList.splice(index, 1);
      this.setState({ expandedTagsList: newExpandTagsList });
    } else {
      this.setState({ expandedTagsList: [...expandedTagsList, tag] });
    }
  };

  setStateForTagUser(tag, userName) {
    this.setState(prevState => {
      const newFeatureList = prevState.featureList.clone();
      newFeatureList.setUserForTag(tag, userName);
      return { ...prevState, featureList: newFeatureList, warningArgs: null };
    });
  }

  handleTagAssigned = (restId, tag, prevUserName, userName) => {
    var newUserName = userName;
    if (prevUserName === userName) {
      newUserName = null;
    }
    setTagAssignmentData(restId, new TagAssignmentPatch(tag, newUserName)).then(response => {
      if (!response || !response.ok) {
        this.setStateForTagUser(tag, prevUserName);
      }
    });
    this.setStateForTagUser(tag, newUserName);
  };

  handleWarningShow = (...args) => {
    this.setState({ warningArgs: args });
  };

  handleWarningClosed = () => {
    this.setState({ warningArgs: null });
  };

  handleTagIgnore = (product, tagName) => {
    setIgnoredTag(product, { tagName: tagName }).then(response => {
      if (!response || !response.ok) {
        this.setIgnoreStateForTag(tagName);
      }
    });
    this.setIgnoreStateForTag(tagName);
  };

  setIgnoreStateForTag(tagName) {
    this.setState(prevState => {
      const newFeatureList = prevState.featureList.clone();
      newFeatureList.toggleIgnoreForTag(tagName);
      return { ...prevState, featureList: newFeatureList };
    });
  }

  filterTags(userName) {
    const { featureList, isAssignedTagsView, selectedStatus } = this.state;
    var newTagList = featureList.tagList;

    if (isAssignedTagsView) {
      newTagList = newTagList.filter(tag => tag.userName === userName);
    }

    return newTagList.filter(
      tag =>
        (selectedStatus.passed && tag.containsPassed) ||
        (selectedStatus.failed && tag.containsFailed) ||
        (selectedStatus.undefined && tag.containsUndefined) ||
        (selectedStatus.skipped && tag.containsSkipped)
    );
  }

  renderAssignedTagsSwitch() {
    const { classes } = this.props;
    const { isEditMode, isAssignedTagsView } = this.state;
    return (
      <>
        <Tooltip title={isEditMode ? 'Turn Edit Mode Off' : 'Turn Edit Mode On'} placement="top">
          <Checkbox
            onChange={this.handleEditModeSwitch}
            icon={<FontAwesomeIcon icon={faUserSlash} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserSlash} className={classes.checkedIcon} />}
            checked={isEditMode}
          />
        </Tooltip>
        <Tooltip title={isAssignedTagsView ? 'Show All Tags' : 'Show Only Assigned Tags'} placement="top">
          <Checkbox
            onChange={this.handleTagsSwitch}
            icon={<FontAwesomeIcon icon={faUserTag} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserTag} className={classes.checkedIcon} />}
            checked={isAssignedTagsView}
          />
        </Tooltip>
      </>
    );
  }

  renderViewsSwitch() {
    const { classes } = this.props;
    const { isTagView } = this.state;
    return (
      <Tooltip title={isTagView ? 'Switch to List View' : 'Switch to Tag View'} placement="top">
        <Checkbox
          onChange={this.handleViewSwitch}
          icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
          checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
          checked={isTagView}
        />
      </Tooltip>
    );
  }

  renderFeatureListTitle() {
    const { classes } = this.props;
    const { isTagView } = this.state;
    return (
      <Box className={classes.featureListTitle}>
        <Box p={1} flexGrow={1} className={null}>
          <Typography variant="h5">Features</Typography>
        </Box>
        <Box>
          {isTagView ? this.renderAssignedTagsSwitch() : null}
          {this.renderViewsSwitch()}
        </Box>
      </Box>
    );
  }

  renderFeatureList(userName, restId, selectedFeatureId) {
    const { handleFeatureSelected } = this.props;
    const { isTagView, isEditMode, isAssignedTagsView, selectedStatus, expandedTagsList, featureList } = this.state;
    if (isTagView) {
      return (
        <TagList
          userName={userName}
          isEditMode={isEditMode}
          isAssignedTagsView={isAssignedTagsView}
          tagList={this.filterTags(userName)}
          restId={restId}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={selectedStatus}
          expandedTagsList={expandedTagsList}
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
          featureList={featureList.simpleFeatureList}
          selectedStatus={selectedStatus}
          handleFeatureSelected={handleFeatureSelected}
        />
      );
    }
  }

  render() {
    const { product, version, build, userName, selectedFeatureId, classes } = this.props;
    const { loading, warningArgs, selectedStatus } = this.state;
    const restId = `${product}/${version}/${build}`;
    if (this.state.featureList) {
      return (
        <>
          <Loading loading={loading} />
          <ConfirmationDialog
            open={!!warningArgs}
            title={'Warning!!'}
            msg={'Reassigning The Tag'}
            handleConfirmed={() => warningArgs && this.handleTagAssigned(...warningArgs)}
            handleClosed={this.handleWarningClosed}
          />
          <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
          <div className={classes.xbddTagListContainer}>
            {this.renderFeatureListTitle()}
            {this.renderFeatureList(userName, restId, selectedFeatureId)}
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
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  userName: state.app.user,
});

export default connect(mapStateToProps)(withStyles(featureListContainerStyles)(FeatureListContainer));
