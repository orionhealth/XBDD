
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import BlockIcon from '@material-ui/icons/Block';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Card } from '@material-ui/core';
import FeatureHistory from '../models/FeatureHistory';

const styles = theme => ({
    buildHistoryViewContainer: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: theme.palette.background.paper,
    },
});

const getIcon = (status, lastEditedBy) => {
    let lastEditedByText = '';
    if (lastEditedBy) {
        lastEditedByText = `, Last Edited By: ${lastEditedBy}`;
    }
    if (status === 'passed') {
        return <Tooltip title={`Status: Passed${lastEditedByText}`} placement="bottom-end"><CheckBoxIcon /></Tooltip>;
    } else if (status === 'failed') {
        return <Tooltip title={`Status: Failed${lastEditedByText}`} placement="bottom-end"><ErrorOutlineIcon /></Tooltip>;
    } else if (status === 'skipped') {
        return <Tooltip title={`Status: Skipped${lastEditedByText}`} placement="bottom-end"><BlockIcon /></Tooltip>;
    }
    return <Tooltip title={`Status: Unknown${lastEditedByText}`} placement="bottom-end"><HelpOutlineIcon /></Tooltip>;
};

class BuildHistoryViewContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <Card raised className={classes.buildHistoryViewContainer}>
                <div className="xbdd-feature-history-view-title">Execution History</div>
                <GridList className={classes.gridList} cols={20} spacing={0} cellHeight="auto">
                    {this.props.featureRollupData.builds.map(build => (
                        <GridListTile key={build.buildNumber}>
                            {
                                getIcon(build.calculatedStatus, build.statusLastEditedBy)
                            }
                        </GridListTile>
                    ))}
                </GridList>
            </Card>
        );
    }
}

BuildHistoryViewContainer.propTypes = {
    classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    featureRollupData: PropTypes.instanceOf(FeatureHistory).isRequired,
};

export default withStyles(styles)(BuildHistoryViewContainer);
