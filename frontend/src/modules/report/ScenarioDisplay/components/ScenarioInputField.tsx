import React, { Component, ReactNode } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { inputFieldStyles } from './styles/ScenarioStepStyles';

interface Props extends WithStyles {
  label: string;
  value: string;
  handleCommentUpdate(label: string, requestLabel: string, prevContent: string, content: string): void;
}

interface State {
  content: string;
  prevContent: string;
}

class ScenarioInputField extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      prevContent: this.props.value,
      content: this.props.value,
    };
  }

  componentDidUpdate(prevProps: Props): void {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({
        prevContent: value,
        content: value,
      });
    }
  }

  handleValueChanged = (event): void => {
    this.setState({ content: event.target.value });
  };

  handleCommentFocused = (event): void => {
    this.setState({ prevContent: event.target.value });
  };

  render(): ReactNode {
    const { label, handleCommentUpdate, classes } = this.props;
    const { prevContent, content } = this.state;

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
          value={content}
          onChange={this.handleValueChanged}
          onFocus={this.handleCommentFocused}
          onBlur={(): void => handleCommentUpdate(labelMap[label], requestLabelMap[label], prevContent, content)}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  }
}

export default withStyles(inputFieldStyles)(ScenarioInputField);
