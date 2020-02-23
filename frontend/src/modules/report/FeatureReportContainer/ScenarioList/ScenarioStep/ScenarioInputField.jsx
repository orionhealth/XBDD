import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { inputFielsStyles } from './styles/ScenarioStepStyles';

class ScenarioInputField extends Component {
  constructor(props) {
    super(props);
    const content = props.value;
    this.state = {
      prevContent: content,
      content: content,
    };

    this.handleValueChanged = this.handleValueChanged.bind(this);
    this.handleCommentFocused = this.handleCommentFocused.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      const content = this.props.value;
      this.setState({
        prevContent: content,
        content: content,
      });
    }
  }

  handleValueChanged(event) {
    this.setState({ content: event.target.value });
  }

  handleCommentFocused(event) {
    this.setState({ prevContent: event.target.value });
  }

  render() {
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
          onChange={e => this.handleValueChanged(e)}
          onFocus={e => this.handleCommentFocused(e)}
          onBlur={() =>
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

ScenarioInputField.propTypes = {
  scenarioId: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleScenarioCommentChanged: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(inputFielsStyles)(ScenarioInputField);
