import React, { FC, useState, KeyboardEvent } from 'react';
import { makeStyles, createStyles, Dialog, DialogContent } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    screenshot: {
      margin: '20px 0 0 24px',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      height: '50%',
      width: '50%',
    },
  })
);

interface Props {
  screenshotPath: string;
}

const StepScreenshot: FC<Props> = ({ screenshotPath }) => {
  const [enhanceScreenShot, setEnhanceScreenshot] = useState(false);
  const classes = useStyles();

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
