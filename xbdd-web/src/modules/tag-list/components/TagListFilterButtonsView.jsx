import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import BlockIcon from '@material-ui/icons/Block';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { tagListFilterButtonStyles } from '../styles/TagListStyles';

const buttonTheme = color => createMuiTheme({
    palette: {
        primary: { main: color },
        secondary: { main: '#E0E0E0' },
    },
});

const createButton = variant => (
    <MuiThemeProvider theme={variant.theme}>
        <Tooltip title={variant.tooltip} placement="top">
            <IconButton
                className={variant.className}
                onClick={variant.handler}
                variant="outlined"
                size="small"
                color={variant.color}
            >
                {variant.icon}
            </IconButton>
        </Tooltip>
    </MuiThemeProvider>
);

const TagListFilterButtonsView = (props) => {
    const variants = {
        passed: {
            theme: buttonTheme('#1d3557'),
            icon: <DoneIcon />,
            tooltip: 'Passed',
            color: props.filterStates.passedSelected ? 'primary' : 'secondary',
            handler: () => props.onFilterButtonClick('passedSelected'),
            className: `${props.classes.xbddFilterButton} ${props.classes.xbddFilterButtonFirst}`,
        },
        failed: {
            theme: buttonTheme('#E63946'),
            icon: <ErrorOutlineIcon />,
            tooltip: 'Failed',
            color: props.filterStates.failedSelected ? 'primary' : 'secondary',
            handler: () => props.onFilterButtonClick('failedSelected'),
            className: `${props.classes.xbddFilterButton}`,
        },
        undefined: {
            theme: buttonTheme('#A8DADC'),
            icon: <HelpOutlineIcon />,
            tooltip: 'Undefined',
            color: props.filterStates.undefinedSelected ? 'primary' : 'secondary',
            handler: () => props.onFilterButtonClick('undefinedSelected'),
            className: `${props.classes.xbddFilterButton}`,
        },
        skipped: {
            theme: buttonTheme('#457B9D'),
            icon: <BlockIcon />,
            tooltip: 'Skipped',
            color: props.filterStates.skippedSelected ? 'primary' : 'secondary',
            handler: () => props.onFilterButtonClick('skippedSelected'),
            className: `${props.classes.xbddFilterButton} ${props.classes.xbddFilterButtonLast}`,
        },
    };

    return (
        <div className={props.classes.xbddTagListFilterButtons}>
            {createButton(variants.passed)}
            {createButton(variants.failed)}
            {createButton(variants.undefined)}
            {createButton(variants.skipped)}
        </div>
    );
};

TagListFilterButtonsView.propTypes = {
    filterStates: PropTypes.object.isRequired,
    onFilterButtonClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(tagListFilterButtonStyles)(TagListFilterButtonsView);
