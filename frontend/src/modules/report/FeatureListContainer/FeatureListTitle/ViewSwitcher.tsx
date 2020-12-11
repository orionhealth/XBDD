import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Checkbox } from '@material-ui/core';
import React, { Dispatch, SetStateAction, FC } from 'react';

import { useViewSwitcherStyles } from './styles/FeatureListTitleStyles';

interface Props {
  flag: boolean;
  flagSetter: Dispatch<SetStateAction<boolean>>;
  titleOn: string;
  titleOff: string;
  iconName: IconDefinition;
}

const ViewSwitcher: FC<Props> = ({ flag, flagSetter, titleOn, titleOff, iconName }) => {
  const classes = useViewSwitcherStyles();
  const title = flag ? titleOn : titleOff;

  return (
    <Tooltip title={title} placement="top">
      <Checkbox
        onChange={(): void => flagSetter(!flag)}
        icon={<FontAwesomeIcon icon={iconName} className={classes.unCheckedIcon} />}
        checkedIcon={<FontAwesomeIcon icon={iconName} className={classes.checkedIcon} />}
        checked={flag}
      />
    </Tooltip>
  );
};

export default ViewSwitcher;
