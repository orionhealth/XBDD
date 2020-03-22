import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Typography, Checkbox, Tooltip, Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faUserTag, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ConfirmationDialog from 'modules/utils/ConfirmationDialog';
import { setTagAssignmentData, setIgnoredTag } from 'lib/rest/Rest';
import { featureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';
import Loading from 'modules/loading/Loading';
import fetchSimpleFeaturesByTags from 'lib/services/FetchSimpleFeaturesByTags';
import fetchSimpleFeatures from 'lib/services/FetchSimpleFeatures';
import fetchTagAssignments from 'lib/services/FetchTagAssignments';
import fetchTagsIgnored from 'lib/services/FetchTagsIgnored';
import produce from 'immer';
import { dispatch } from 'rxjs/internal/observable/range';
import { receivedTagsIgnored } from 'xbddReducer';

class FeatureListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warningArgs: null,
      isEditMode: false,
      isAssignedTagsView: false,
      isTagView: true,
      tagList: [],
      simpleFeatureList: [],
      tagAssignments: {},
      tagsIgnored: {},
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
      loading: false,
    };
  }

  componentDidMount() {
    const { product, version, build } = this.props;
    this.setState({ loading: true });
    Promise.all([
      fetchSimpleFeaturesByTags(product, version, build),
      fetchSimpleFeatures(product, version, build),
      fetchTagAssignments(product, version, build),
      fetchTagsIgnored(product),
    ])
      .then(data => {
        this.setState({
          tagList: data[0], // :Tag
          simpleFeatureList: data[1], // :Feature[]
          tagAssignments: data[2], //:TagAssignments
        });
        const tagsIgnored = data[3]; //:TagsIgnored
        dispatch(receivedTagsIgnored, tagsIgnored);
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

  setStateForTagUser(tag, userName) {
    this.setState(
      produce(draft => {
        draft.tagAssignments[tag] = userName;
      })
    );
  }

  handleTagAssigned = (restId, tag, newUserName, prevUserName) => {
    if (newUserName && prevUserName && newUserName !== prevUserName) {
      this.setState({ warningArgs: { restId, tag, newUserName, prevUserName } });
    } else {
      const userName = prevUserName === newUserName ? null : newUserName;

      setTagAssignmentData(restId, { tag, userName }).then(response => {
        if (!response || !response.ok) {
          this.setStateForTagUser(tag, prevUserName);
        }
      });
      this.setStateForTagUser(tag, userName);
    }
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
    this.setState(
      produce(draft => {
        draft.tagsIgnored[tagName] = !draft.tagsIgnored[tagName];
      })
    );
  }

  filterTags(userName) {
    const { tagList, isAssignedTagsView, selectedStatus, tagAssignments } = this.state;
    let filteredTagList = tagList;

    if (isAssignedTagsView) {
      filteredTagList = filteredTagList.filter(tag => tagAssignments[tag.name] === userName);
    }
    filteredTagList = filteredTagList.filter(tag => tag.features.find(feature => selectedStatus[feature.calculatedStatus]));

    return filteredTagList;
  }

  renderAssignedTagsSwitch() {
    const { classes, t } = this.props;
    const { isEditMode, isAssignedTagsView } = this.state;
    return (
      <>
        <Tooltip title={isEditMode ? t('report.turnEditModeOff') : t('report.turnEditModeOn')} placement="top">
          <Checkbox
            onChange={this.handleEditModeSwitch}
            icon={<FontAwesomeIcon icon={faUserSlash} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserSlash} className={classes.checkedIcon} />}
            checked={isEditMode}
          />
        </Tooltip>
        <Tooltip title={isAssignedTagsView ? t('report.showAllTags') : t('report.showAssignedTags')} placement="top">
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
    const { classes, t } = this.props;
    const { isTagView } = this.state;
    return (
      <Tooltip title={isTagView ? t('report.switchToListView') : t('report.switchToTagView')} placement="top">
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
    const { isTagView, isEditMode, isAssignedTagsView, selectedStatus, simpleFeatureList, tagAssignments, tagsIgnored } = this.state;
    if (isTagView) {
      return (
        <TagList
          loggedInUserName={userName}
          isEditMode={isEditMode}
          isAssignedTagsView={isAssignedTagsView}
          tagList={this.filterTags(userName)}
          tagAssignments={tagAssignments}
          tagsIgnored={tagsIgnored}
          restId={restId}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={selectedStatus}
          handleFeatureSelected={handleFeatureSelected}
          handleTagAssigned={this.handleTagAssigned}
          handleTagIgnore={this.handleTagIgnore}
        />
      );
    } else {
      return (
        <ListViewFeatureList
          selectedFeatureId={selectedFeatureId}
          featureList={simpleFeatureList}
          selectedStatus={selectedStatus}
          handleFeatureSelected={handleFeatureSelected}
        />
      );
    }
  }

  render() {
    const { product, version, build, userName, selectedFeatureId, classes, t } = this.props;
    const { loading, warningArgs, selectedStatus } = this.state;

    const restId = `${product}/${version}/${build}`;

    return (
      <>
        <Loading loading={loading} />
        <ConfirmationDialog
          open={!!warningArgs}
          title={t('report.warning')}
          msg={t('report.pleaseReassignTheTag')}
          handleConfirmed={() => warningArgs && this.handleTagAssigned(warningArgs.restId, warningArgs.tag, warningArgs.newUserName, null)}
          handleClosed={() => {
            this.setState({ warningArgs: null });
          }}
        />
        <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
        <div className={classes.xbddTagListContainer}>
          {this.renderFeatureListTitle()}
          {this.renderFeatureList(userName, restId, selectedFeatureId)}
        </div>
      </>
    );
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

export default connect(mapStateToProps)(withTranslation()(withStyles(featureListContainerStyles)(FeatureListContainer)));
