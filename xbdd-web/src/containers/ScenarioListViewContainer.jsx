import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Card } from '@material-ui/core';
import Feature from '../models/Feature';
import '../styles/ScenarioListView.css';

const styles = theme => ({
    scenarioListContainer: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
});

class ScenarioListViewContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
        };
    }

    displayScenarioDetails() {
        this.setState({
            isActive: this.state.isActive,
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Card raised className={classes.scenarioListContainer}>
                <List>
                    {this.props.feature.scenarios.map(value => (
                        <ListItem key={value.id} dense button className="{classes.listItem}">
                            <ListItemText
                                primary={value.name}
                                onClick={this.displayScenarioDetails}

                            />
                        </ListItem>
                    ))}
                </List>
            </Card>
        );
    }
}

ScenarioListViewContainer.propTypes = {
    classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    feature: PropTypes.instanceOf(Feature).isRequired,
};

export default withStyles(styles)(ScenarioListViewContainer);
