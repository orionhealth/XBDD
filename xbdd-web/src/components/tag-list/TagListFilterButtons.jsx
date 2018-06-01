import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import BlockIcon from '@material-ui/icons/Block';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { tagListFilterButtonStyles } from './TagListStyles';

const buttonTheme = color => createMuiTheme({
    palette: {
        primary: { main: color },
        secondary: { main: '#E0E0E0' },
    },
});

class TagListFilterButtons extends Component {
    constructor(props) {
        super(props);

        this.variants = {
            passed: {
                theme: buttonTheme('#1d3557'),
                icon: <DoneIcon />,
                tooltip: 'Passed',
                stateAttribute: 'passedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'passedSelected'),
                className: `${this.props.classes.xbddFilterButton} ${this.props.classes.xbddFilterButtonFirst}`,
            },
            failed: {
                theme: buttonTheme('#E63946'),
                icon: <ErrorOutlineIcon />,
                tooltip: 'Failed',
                stateAttribute: 'failedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'failedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            undefined: {
                theme: buttonTheme('#A8DADC'),
                icon: <HelpOutlineIcon />,
                tooltip: 'Undefined',
                stateAttribute: 'undefinedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'undefinedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            skipped: {
                theme: buttonTheme('#457B9D'),
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
                        size="small"
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

export default withStyles(tagListFilterButtonStyles)(TagListFilterButtons);
