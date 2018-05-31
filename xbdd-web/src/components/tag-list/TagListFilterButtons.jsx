import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    xbddTagListFilterButtons: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
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
                text: 'Passed',
                stateAttribute: 'passedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'passedSelected'),
                className: `${this.props.classes.xbddFilterButton} ${this.props.classes.xbddFilterButtonFirst}`,
            },
            undefined: {
                theme: buttonTheme(amber),
                text: 'Undefined',
                stateAttribute: 'undefinedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'undefinedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            failed: {
                theme: buttonTheme(red),
                text: 'Failed',
                stateAttribute: 'failedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'failedSelected'),
                className: `${this.props.classes.xbddFilterButton}`,
            },
            skipped: {
                theme: buttonTheme(blue),
                text: 'Skipped',
                stateAttribute: 'skippedSelected',
                handler: this.props.onFilterButtonClick.bind(this, 'skippedSelected'),
                className: `${this.props.classes.xbddFilterButton} ${this.props.classes.xbddFilterButtonLast}`,
            },
        };
    }

    createButton(variant) {
        return (
            <MuiThemeProvider theme={variant.theme}>
                <Button
                    className={variant.className}
                    onClick={variant.handler}
                    variant="outlined"
                    color={this.props.state[variant.stateAttribute] ? 'primary' : 'secondary'}
                >
                    {variant.text}
                </Button>
            </MuiThemeProvider>
        );
    }

    render() {
        return (
            <div className={this.props.classes.xbddTagListFilterButtons}>
                {this.createButton(this.variants.passed)}
                {this.createButton(this.variants.undefined)}
                {this.createButton(this.variants.failed)}
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
