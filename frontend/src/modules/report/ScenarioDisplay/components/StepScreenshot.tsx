import React, { FC, useState, KeyboardEvent } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';

import { useSceenshotStyles } from './styles/ScenarioComponentsStyles';

interface Props {
  screenshotPath: string;
}

const StepScreenshot: FC<Props> = ({ screenshotPath }) => {
  const [enhanceScreenShot, setEnhanceScreenshot] = useState(false);
  const classes = useSceenshotStyles();

  const url = `${process.env.REACT_APP_BACKEND_HOST}/rest/attachment/${screenshotPath}`;

  return (
    <>
      <span
        onClick={(): void => setEnhanceScreenshot(true)}
        onKeyPress={(e: KeyboardEvent<HTMLElement>): void => {
          if (e.key === 'Enter') {
            setEnhanceScreenshot(true);
          }
        }}
      >
        <img src={url} alt="" className={classes.screenshot} />
      </span>
      <Dialog
        open={enhanceScreenShot}
        onClose={(): void => setEnhanceScreenshot(false)}
        onEscapeKeyDown={(): void => setEnhanceScreenshot(false)}
        onBackdropClick={(): void => setEnhanceScreenshot(false)}
        maxWidth={false}
      >
        <DialogContent>{<img src={url} alt="" style={{ height: '100%', width: '100%' }} />}</DialogContent>
      </Dialog>
    </>
  );
};

export default StepScreenshot;
