import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FeatureHistory from '../models/FeatureHistory';
import FeatureBuildHistoryViewContainer from '../components/FeatureBuildHistoryView';

const styles = theme => ({
    featureSummaryViewContainer: {
        width: '100%',
        maxWidth: 770,
        backgroundColor: theme.palette.background.paper,
    },
});

class FeatureSummaryViewContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="featureSummaryViewContainer">
                <FeatureBuildHistoryViewContainer featureRollupData={this.props.featureRollupData} />
            </div>
        );
    }
}

FeatureSummaryViewContainer.propTypes = {
    featureRollupData: PropTypes.instanceOf(FeatureHistory).isRequired,
};

export default withStyles(styles)(FeatureSummaryViewContainer);
