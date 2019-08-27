import React from "react";
import { PropTypes } from "prop-types";
import { withStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import BlockIcon from "@material-ui/icons/Block";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { tagListFilterButtonStyles } from "../styles/TagListStyles";
import { Card } from "@material-ui/core";

const buttonTheme = color =>
  createMuiTheme({
    palette: {
      primary: { main: color },
      secondary: { main: "#E0E0E0" },
    },
    typography: {
      useNextVariants: true,
    },
  });

const createButton = variant => (
  <MuiThemeProvider theme={variant.theme}>
    <Tooltip title={variant.tooltip} placement="top">
      <IconButton className={variant.className} onClick={variant.handler} variant="outlined" size="small" color={variant.color}>
        {variant.icon}
      </IconButton>
    </Tooltip>
  </MuiThemeProvider>
);

const TagListFilterButtonsView = props => {
  const { classes, filterStates, onFilterButtonClick } = props;
  const variants = {
    passed: {
      theme: buttonTheme("#1d3557"),
      icon: <DoneIcon className={classes.xbddFilterButtonIcon} />,
      tooltip: "Passed",
      color: filterStates.passedSelected ? "primary" : "secondary",
      handler: () => onFilterButtonClick("passedSelected"),
      className: `${classes.xbddFilterButton} ${classes.xbddFilterButtonFirst}`,
    },
    failed: {
      theme: buttonTheme("#E63946"),
      icon: <ErrorOutlineIcon className={classes.xbddFilterButtonIcon} />,
      tooltip: "Failed",
      color: filterStates.failedSelected ? "primary" : "secondary",
      handler: () => onFilterButtonClick("failedSelected"),
      className: `${classes.xbddFilterButton}`,
    },
    undefined: {
      theme: buttonTheme("#A8DADC"),
      icon: <HelpOutlineIcon className={classes.xbddFilterButtonIcon} />,
      tooltip: "Undefined",
      color: filterStates.undefinedSelected ? "primary" : "secondary",
      handler: () => onFilterButtonClick("undefinedSelected"),
      className: `${classes.xbddFilterButton}`,
    },
    skipped: {
      theme: buttonTheme("#457B9D"),
      icon: <BlockIcon className={classes.xbddFilterButtonIcon} />,
      tooltip: "Skipped",
      color: filterStates.skippedSelected ? "primary" : "secondary",
      handler: () => onFilterButtonClick("skippedSelected"),
      className: `${classes.xbddFilterButton} ${classes.xbddFilterButtonLast}`,
    },
  };

  return (
    <Card raised className={classes.xbddTagListFilterButtons}>
      {createButton(variants.passed)}
      {createButton(variants.failed)}
      {createButton(variants.undefined)}
      {createButton(variants.skipped)}
    </Card>
  );
};

TagListFilterButtonsView.propTypes = {
  filterStates: PropTypes.shape({}).isRequired,
  onFilterButtonClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListFilterButtonStyles)(TagListFilterButtonsView);
