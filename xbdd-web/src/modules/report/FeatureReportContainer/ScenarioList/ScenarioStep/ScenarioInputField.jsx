import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { inputFielsStyles } from "./styles/ScenarioStepStyles";

const ScenarioInputField = props => {
  const { id, label, placeholder, value, handleScenarioCommentChanged, classes } = props;

  const labelMap = {
    Environment: "environmentNotes",
    "Execution Notes": "executionNotes",
    "Testing Tips": "testingTips",
  };

  return (
    <div className={classes.inputField}>
      <TextField
        label={label}
        placeholder={placeholder}
        multiline
        rows="2"
        fullWidth={true}
        defaultValue={value ? value : ""}
        onBlur={e => handleScenarioCommentChanged(id, labelMap[label], e)}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </div>
  );
};

ScenarioInputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(inputFielsStyles)(ScenarioInputField);
