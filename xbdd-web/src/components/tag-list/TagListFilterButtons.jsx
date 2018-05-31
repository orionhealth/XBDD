import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import BlockIcon from '@material-ui/icons/Block';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const styles = theme => ({
    xbddTagListFilterButtons: {
        height: '48px',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: '15px',
    },
    xbddFilterButton: {
        width: 88,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 0,
        borderRight: 0,
    },
    xbddFilterButtonFirst: {
        borderRadius: '2px 0 0 2px',
    },
    xbddFilterButtonLast: {
        borderRight: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '0 2px 2px 0',
    },
});

const buttonTheme = color => createMuiTheme({
    palette: {
        primary: color,
        secondary: grey,
    },
});

class TagListFilterButtons extends Component {
    constructor(props) {
        super(props);

        this.variants = {
            passed: {
                theme: buttonTheme(green),
                icon: <DoneIcon />,
                tooltip: 'Passed',
                stateAttribute: 'passedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'passedSelected'),
                className: `${this.props.classes.xbddFilterButton} ${this.props.classes.xbddFilterButtonFirst}`,
            },
            failed: {
                theme: buttonTheme(red),
                icon: <ErrorOutlineIcon />,
                tooltip: 'Failed',
                stateAttribute: 'failedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'failedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            undefined: {
                theme: buttonTheme(amber),
                icon: <HelpOutlineIcon />,
                tooltip: 'Undefined',
                stateAttribute: 'undefinedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'undefinedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            skipped: {
                theme: buttonTheme(blue),
                icon: <BlockIcon />,
                tooltip: 'Skipped',
                stateAttribute: 'skippedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'skippedSelected'),
                className: `${this.props.classes.xbddFilterButton} ${this.props.classes.xbddFilterButtonLast}`,
            },
        };
    }

    createButton(variant) {
        return (
            <MuiThemeProvider theme={variant.theme}>
                <Tooltip title={variant.tooltip} placement="top">
                    <IconButton
                        className={variant.className}
                        onClick={variant.handler}
                        variant="outlined"
                        color={this.props.state[variant.stateAttribute] ? 'primary' : 'secondary'}
                    >
                        {variant.icon}
                    </IconButton>
                </Tooltip>
            </MuiThemeProvider>
        );
    }

    render() {
        return (
            <div className={this.props.classes.xbddTagListFilterButtons}>
                {this.createButton(this.variants.passed)}
                {this.createButton(this.variants.failed)}
                {this.createButton(this.variants.undefined)}
                {this.createButton(this.variants.skipped)}
            </div>
        );
    }
}

TagListFilterButtons.propTypes = {
    state: PropTypes.object.isRequired,
    onFilterButtonClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TagListFilterButtons);
