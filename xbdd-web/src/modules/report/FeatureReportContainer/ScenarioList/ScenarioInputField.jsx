import React from "react";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { inputFielsStyles } from "./styles/ScenarioListStyles";

const ScenarioInputField = props => {
  const { label, placeholder, classes } = props;

  return (
    <div className={classes.inputField}>
      <TextField
        label={label}
        placeholder={placeholder}
        multiline
        rows="2"
        fullWidth={true}
        // value={values.multiline}
        // onChange={handleChange("multiline")}
        className={classes.textField}
        margin="dense"
        variant="outlined"
      />
    </div>
  );
};

export default withStyles(inputFielsStyles)(ScenarioInputField);
