import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FeatureHistory from '../../../models/FeatureHistory';
import FeatureBuildHistoryViewContainer from './FeatureBuildHistoryViewContainer';
import { featureSummaryStyles }  from './styles/FeatureSummaryStyles'

const FeatureSummaryViewContainer = props => (
  <div className={props.classes.featureSummaryViewContainer}>
    <FeatureBuildHistoryViewContainer featureRollupData={props.featureRollupData} />
  </div>
);

FeatureSummaryViewContainer.propTypes = {
  featureRollupData: PropTypes.instanceOf(FeatureHistory).isRequired,
};

export default withStyles(featureSummaryStyles)(FeatureSummaryViewContainer);
