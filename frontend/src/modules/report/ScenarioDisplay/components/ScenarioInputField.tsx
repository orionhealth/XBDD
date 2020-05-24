import React, { FC, ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { inputFieldStyles } from './styles/ScenarioStepStyles';
import { updateCommentWithRollback } from 'redux/FeatureReducer';

interface Props extends WithStyles {
  scenarioId: string;
  label: string;
  content: string;
}

const ScenarioInputField: FC<Props> = ({ scenarioId, label, content, classes }) => {
  const [text, setText] = useState(content);
  const dispatch = useDispatch();

  const labelMap = {
    Environment: 'environmentNotes',
    'Execution Notes': 'executionNotes',
    'Testing Tips': 'testingTips',
  };

  const requestLabelMap = {
    Environment: 'environment-notes',
    'Execution Notes': 'execution-notes',
    'Testing Tips': 'testing-tips',
  };

  return (
    <div className={classes.inputField}>
      <TextField
        label={label}
        multiline
        rows="2"
        fullWidth={true}
        value={text}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => setText(event.target.value)}
        onBlur={(): void => {
          dispatch(updateCommentWithRollback(scenarioId, labelMap[label], requestLabelMap[label], text));
        }}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </div>
  );
};

export default withStyles(inputFieldStyles)(ScenarioInputField);
