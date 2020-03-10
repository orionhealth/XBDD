import React, { Component, ReactNode } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { inputFieldStyles } from './styles/ScenarioStepStyles';

interface Props extends WithStyles {
  scenarioId: string;
  label: string;
  placeholder: string;
  value: string;
  handleScenarioCommentChanged(scenarioId: string, label: string, requestLabel: string, prevContent: string, content: string): void;
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
    const { scenarioId, label, placeholder, handleScenarioCommentChanged, classes } = this.props;

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
          placeholder={placeholder}
          multiline
          rows="2"
          fullWidth={true}
          value={this.state.content}
          onChange={this.handleValueChanged}
          onFocus={this.handleCommentFocused}
          onBlur={(): void =>
            handleScenarioCommentChanged(scenarioId, labelMap[label], requestLabelMap[label], this.state.prevContent, this.state.content)
          }
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  }
}

export default withStyles(inputFieldStyles)(ScenarioInputField);
