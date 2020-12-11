import React, { FC } from 'react';
import { List } from '@material-ui/core';

import { useStepsStyles } from './styles/ScenarioComponentsStyles';
import Step from 'models/Step';
import StepScreenshot from './StepScreenshot';
import ScenarioStep from './ScenarioStep';

interface Props {
  scenarioId: string;
  title: string;
  steps: Step[];
}

const ScenarioSteps: FC<Props> = ({ scenarioId, title, steps }) => {
  const classes = useStepsStyles();

  return (
    <div className={classes.steps}>
      <div className={classes.stepsTitle}>{title}</div>
      <List>
        {steps.map(step => (
          <div key={step.id}>
            <ScenarioStep scenarioId={scenarioId} step={step} />
            {step.embeddings && step.embeddings.map(embedding => <StepScreenshot key={embedding} screenshotPath={embedding} />)}
          </div>
        ))}
      </List>
    </div>
  );
};

export default ScenarioSteps;
