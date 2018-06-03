import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FeatureHistory from '../models/FeatureHistory';
import BuildHistoryViewContainer from '../components/BuildHistoryView';

const styles = theme => ({
    featureHistoryViewContainer: {
        width: '100%',
        maxWidth: 430,
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
            <div className="buildHistoryView">
                <BuildHistoryViewContainer featureRollupData={this.props.featureRollupData} />
            </div>
        );
    }
}

FeatureSummaryViewContainer.propTypes = {
    featureRollupData: PropTypes.instanceOf(FeatureHistory).isRequired,
};

export default withStyles(styles)(BuildHistoryViewContainer);
