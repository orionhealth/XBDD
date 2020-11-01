import React, { FC, ChangeEvent, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { useInputFieldStyles } from './styles/ScenarioComponentsStyles';
import { updateCommentWithRollback } from 'redux/FeatureReducer';

interface Props {
  scenarioId: string;
  label: string;
  content: string;
}

const ScenarioInputField: FC<Props> = ({ scenarioId, label, content }) => {
  const dispatch = useDispatch();
  const classes = useInputFieldStyles();
  const [text, setText] = useState(content);

  useEffect(() => setText(content), [content]);

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
        margin="normal"
        variant="outlined"
      />
    </div>
  );
};

export default ScenarioInputField;
