import React, { Component, ReactNode } from 'react';
import { Typography, Checkbox, Tooltip, Box, WithStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faUserTag, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import produce from 'immer';
import { bindActionCreators } from 'redux';

import ConfirmationDialog from './ConfirmationDialog/ConfirmationDialog';
import { assignTagToLoggedInUser, unAssignTag, setIgnoredTag } from 'lib/rest/Rest';
import { featureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons/FeatureFilterButtons';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';
import Loading from 'modules/loading/Loading';
import fetchSimpleFeaturesByTags from 'lib/services/FetchSimpleFeaturesByTags';
import fetchSimpleFeatures from 'lib/services/FetchSimpleFeatures';
import fetchTagAssignments from 'lib/services/FetchTagAssignments';
import fetchTagsIgnored from 'lib/services/FetchTagsIgnored';
import { receivedTagsIgnored, tagIgnoreToggled } from 'redux/TagsIgnoredReducer';
import { LoggedInUser, User } from 'models/User';
import Status, { StatusMap } from 'models/Status';
import Tag, { TagName } from 'models/Tag';
import TagAssignments from 'models/TagAssignments';
import SimpleFeature from 'models/SimpleFeature';
import TagsIgnored from 'models/TagsIgnored';
import { StoreDispatch } from 'rootReducer';

interface ProvidedProps extends WithStyles, WithTranslation {
  user: LoggedInUser;
  productId: string;
  versionString: string;
  build: string;
  selectedFeatureId?: string;
  handleFeatureSelected(feature: SimpleFeature): void;
}

interface DispatchProps {
  dispatchReceivedTagsIgnored(tagsIgnored: TagsIgnored): void;
  dispatchTagIgnoreToggled(tagName: TagName): void;
}

type Props = ProvidedProps & DispatchProps;

interface State {
  warningArgs: { restId: string; tag: string; newUser: User; prevUser: User } | null;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  isTagView: boolean;
  tagList: Tag[];
  simpleFeatureList: SimpleFeature[];
  tagAssignments: TagAssignments;
  selectedStatus: StatusMap<boolean>;
  loading: boolean;
}

class FeatureListContainer extends Component<Props, State> {
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
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
      loading: false,
    };
  }

  componentDidMount(): void {
    const { productId, versionString, build, dispatchReceivedTagsIgnored } = this.props;
    this.setState({ loading: true });
    Promise.all([
      fetchSimpleFeaturesByTags(productId, versionString, build),
      fetchSimpleFeatures(productId, versionString, build),
      fetchTagAssignments(productId, versionString, build),
      fetchTagsIgnored(productId),
    ])
      .then(data => {
        this.setState(prevState => ({
          ...prevState,
          tagList: data[0] || [], // :Tag[]
          simpleFeatureList: data[1] || [], // :Feature[]
          tagAssignments: data[2] || {}, //:TagAssignments
        }));
        const tagsIgnored = data[3] || {}; //:TagsIgnored
        dispatchReceivedTagsIgnored(tagsIgnored);
      })
      .finally(() => this.setState({ loading: false }));
  }

  handleViewSwitch = (): void => {
    this.setState(prevState => ({ ...prevState, isTagView: !prevState.isTagView }));
  };

  handleTagsSwitch = (): void => {
    this.setState(prevState => ({ ...prevState, isAssignedTagsView: !prevState.isAssignedTagsView }));
  };

  handleEditModeSwitch = (): void => {
    this.setState(prevState => ({ ...prevState, isEditMode: !prevState.isEditMode }));
  };

  handleFilterButtonClick = (status: Status): void => {
    this.setState(prevState => ({
      ...prevState,
      selectedStatus: { ...prevState.selectedStatus, [status]: !prevState.selectedStatus[status] },
    }));
  };

  setStateForTagUser(tag: string, user?: User): void {
    this.setState(
      produce(draft => {
        draft.tagAssignments[tag] = user;
      })
    );
  }

  handleTagAssigned = (restId: string, tag: string, currentlyAssignedUser: User): void => {
    const { user } = this.props;
    if (currentlyAssignedUser?.userId && user.userId !== currentlyAssignedUser?.userId) {
      this.setState({ warningArgs: { restId, tag, newUser: user, prevUser: currentlyAssignedUser } });
    } else {
      // While we are just setting the whole user as the new assignee only id, name and avatar will be saved.
      const newAssignee = user.userId === currentlyAssignedUser?.userId ? undefined : user;
      const setTagAssignmentData = newAssignee ? assignTagToLoggedInUser : unAssignTag;

      setTagAssignmentData(restId, tag).then(response => {
        if (!response || !response.ok) {
          this.setStateForTagUser(tag, currentlyAssignedUser);
        }
      });
      this.setStateForTagUser(tag, newAssignee);
    }
  };

  handleTagIgnore = (product: string, tagName: string): void => {
    setIgnoredTag(product, { tagName: tagName }).then(response => {
      if (!response || !response.ok) {
        this.setIgnoreStateForTag(tagName);
      }
    });
    this.setIgnoreStateForTag(tagName);
  };

  setIgnoreStateForTag(tagName: string): void {
    const { dispatchTagIgnoreToggled } = this.props;
    dispatchTagIgnoreToggled(tagName);
  }

  filterTags(): Tag[] {
    const { user } = this.props;
    const { tagList, isAssignedTagsView, selectedStatus, tagAssignments } = this.state;
    let filteredTagList = tagList;

    if (isAssignedTagsView) {
      filteredTagList = filteredTagList.filter(tag => tagAssignments[tag.name]?.userId === user.userId);
    }
    filteredTagList = filteredTagList.filter(tag => tag.features.find(feature => selectedStatus[feature.calculatedStatus]));

    return filteredTagList;
  }

  renderAssignedTagsSwitch(): ReactNode {
    const { classes, t } = this.props;
    const { isEditMode, isAssignedTagsView } = this.state;

    const editModeTitle = isEditMode ? t('report.turnEditModeOff') : t('report.turnEditModeOn');
    const assignedTagsTitle = isAssignedTagsView ? t('report.showAllTags') : t('report.showAssignedTags');

    return (
      <>
        <Tooltip title={editModeTitle} placement="top">
          <Checkbox
            onChange={this.handleEditModeSwitch}
            icon={<FontAwesomeIcon icon={faUserSlash} className={classes.unCheckedIcon} />}
            checkedIcon={<FontAwesomeIcon icon={faUserSlash} className={classes.checkedIcon} />}
            checked={isEditMode}
          />
        </Tooltip>
        <Tooltip title={assignedTagsTitle} placement="top">
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

  renderViewsSwitch(): ReactNode {
    const { classes, t } = this.props;
    const { isTagView } = this.state;

    const title = isTagView ? t('report.switchToListView') : t('report.switchToTagView');

    return (
      <Tooltip title={title} placement="top">
        <Checkbox
          onChange={this.handleViewSwitch}
          icon={<FontAwesomeIcon icon={faTags} className={classes.unCheckedIcon} />}
          checkedIcon={<FontAwesomeIcon icon={faTags} className={classes.checkedIcon} />}
          checked={isTagView}
        />
      </Tooltip>
    );
  }

  renderFeatureListTitle(): ReactNode {
    const { classes, t } = this.props;
    const { isTagView } = this.state;

    return (
      <Box className={classes.featureListTitle}>
        <Box p={1} flexGrow={1}>
          <Typography variant="h5">{t('featureList.features')}</Typography>
        </Box>
        <Box>
          {isTagView ? this.renderAssignedTagsSwitch() : null}
          {this.renderViewsSwitch()}
        </Box>
      </Box>
    );
  }

  renderFeatureList(restId: string, selectedFeatureId?: string): ReactNode {
    const { handleFeatureSelected } = this.props;
    const { isTagView, isEditMode, isAssignedTagsView, selectedStatus, simpleFeatureList, tagAssignments } = this.state;
    if (isTagView) {
      return (
        <TagList
          isEditMode={isEditMode}
          isAssignedTagsView={isAssignedTagsView}
          tagList={this.filterTags()}
          tagAssignments={tagAssignments}
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

  render(): ReactNode {
    const { productId, versionString, build, selectedFeatureId, classes, t } = this.props;
    const { loading, warningArgs, selectedStatus } = this.state;

    const restId = `${productId}/${versionString}/${build}`;

    return (
      <>
        <Loading loading={loading} />
        <ConfirmationDialog
          open={!!warningArgs}
          title={t('report.warning')}
          msg={t('report.pleaseReassignTheTag')}
          handleConfirmed={(): void => {
            if (warningArgs) {
              this.handleTagAssigned(warningArgs.restId, warningArgs.tag, warningArgs.newUser);
            }
          }}
          handleClosed={(): void => {
            this.setState({ warningArgs: null });
          }}
        />
        <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
        <div className={classes.xbddTagListContainer}>
          {this.renderFeatureListTitle()}
          {this.renderFeatureList(restId, selectedFeatureId)}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: StoreDispatch): DispatchProps => ({
  dispatchReceivedTagsIgnored: bindActionCreators(receivedTagsIgnored, dispatch),
  dispatchTagIgnoreToggled: bindActionCreators(tagIgnoreToggled, dispatch),
});

export default connect(null, mapDispatchToProps)(withTranslation()(withStyles(featureListContainerStyles)(FeatureListContainer)));
