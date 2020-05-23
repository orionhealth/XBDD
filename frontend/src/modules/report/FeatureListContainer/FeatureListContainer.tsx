import React, { Component, ReactNode } from 'react';
import { Typography, Checkbox, Tooltip, Box, WithStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faUserTag, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';

import { featureListContainerStyles } from './styles/FeatureListContainerStyles';
import FeatureFilterButtons from './FeatureFilterButtons/FeatureFilterButtons';
import ListViewFeatureList from './ListViewFeatureList/ListViewFeatureList';
import TagList from './TagViewFeatureList/TagList';
import Loading from 'modules/loading/Loading';
import { fetchTagsMetadata } from 'redux/TagsMetadataReducer';
import { LoggedInUser } from 'models/User';
import Status, { StatusMap } from 'models/Status';
import Tag from 'models/Tag';
import TagAssignments from 'models/TagAssignments';
import SimpleFeature from 'models/SimpleFeature';
import { StoreDispatch, RootStore } from 'rootReducer';
import { fetchIndexes } from 'redux/FeatureIndexReducer';

interface ProvidedProps extends WithStyles, WithTranslation {
  user: LoggedInUser;
  productId: string;
  versionString: string;
  build: string;
  selectedFeatureId?: string;
}

interface StateProps {
  idIndex?: SimpleFeature[];
  tagIndex?: Tag[];
  tagAssignments?: TagAssignments;
  loading: boolean;
}

interface DispatchProps {
  dispatchFetchIndexes(productId: string, versionString: string, build: string): void;
  dispatchFetchTagsMetadata(productId: string, versionString: string, build: string): void;
}

type Props = ProvidedProps & StateProps & DispatchProps;

interface State {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  isTagView: boolean;
  selectedStatus: StatusMap<boolean>;
}

class FeatureListContainer extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isEditMode: false,
      isAssignedTagsView: false,
      isTagView: true,
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
    };
  }

  componentDidMount(): void {
    const { productId, versionString, build, dispatchFetchIndexes, dispatchFetchTagsMetadata } = this.props;
    dispatchFetchIndexes(productId, versionString, build);
    dispatchFetchTagsMetadata(productId, versionString, build);
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

  filterTags(): Tag[] {
    const { user, tagAssignments, tagIndex } = this.props;
    const { isAssignedTagsView, selectedStatus } = this.state;
    let filteredTagList = tagIndex || [];

    if (tagAssignments && isAssignedTagsView) {
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
    const { idIndex, tagAssignments, productId, versionString } = this.props;
    const { isTagView, isEditMode, isAssignedTagsView, selectedStatus } = this.state;
    if (isTagView && tagAssignments) {
      return (
        <TagList
          productId={productId}
          versionString={versionString}
          isEditMode={isEditMode}
          isAssignedTagsView={isAssignedTagsView}
          tagList={this.filterTags()}
          tagAssignments={tagAssignments}
          restId={restId}
          selectedFeatureId={selectedFeatureId}
          selectedStatus={selectedStatus}
        />
      );
    } else if (idIndex) {
      return (
        <ListViewFeatureList
          productId={productId}
          versionString={versionString}
          selectedFeatureId={selectedFeatureId}
          featureList={idIndex}
          selectedStatus={selectedStatus}
        />
      );
    }
  }

  render(): ReactNode {
    const { productId, versionString, build, selectedFeatureId, loading, classes } = this.props;
    const { selectedStatus } = this.state;

    const restId = `${productId}/${versionString}/${build}`;

    return (
      <>
        <Loading loading={loading} />
        <FeatureFilterButtons selectedStatus={selectedStatus} handleFilterButtonClick={this.handleFilterButtonClick} />
        <div className={classes.xbddTagListContainer}>
          {this.renderFeatureListTitle()}
          {this.renderFeatureList(restId, selectedFeatureId)}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootStore): StateProps => ({
  idIndex: state.featureIndex.byId || undefined,
  tagIndex: state.featureIndex.byTag || undefined,
  tagAssignments: state.tags.assignments || undefined,
  loading: !(state.featureIndex.byId && state.featureIndex.byTag && state.tags.assignments && state.tags.ignored),
});

const mapDispatchToProps = (dispatch: StoreDispatch): DispatchProps => ({
  dispatchFetchIndexes: bindActionCreators(fetchIndexes, dispatch),
  dispatchFetchTagsMetadata: bindActionCreators(fetchTagsMetadata, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withStyles(featureListContainerStyles)(FeatureListContainer)));
