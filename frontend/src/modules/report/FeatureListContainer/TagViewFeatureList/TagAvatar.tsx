import React, { FC, MouseEvent } from 'react';
import { makeStyles, createStyles, Avatar } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import Tag from 'models/Tag';

const useStyles = makeStyles(() =>
  createStyles({
    userAvatar: {
      height: '32px',
      width: '32px',
      fontSize: '16px',
      marginRight: '4px',
    },
    blockAvatar: {
      height: '32px',
      width: '32px',
      marginRight: '4px',
      color: '#bdbdbd',
    },
  })
);

interface Props {
  tag: Tag;
  onClick(event: MouseEvent): void;
}

const getHSLFromString = (string: string): string => {
  let val = 0;
  for (let i = 0; i < string.length; i++) {
    val += string.charCodeAt(i);
  }
  return 'hsl(' + ((val * val) % 360) + ', 21%, 63%)';
};

const TagAvatar: FC<Props> = ({ tag, onClick }) => {
  const classes = useStyles();

  const { userName, isIgnored } = tag;
  const color = userName ? getHSLFromString(userName) : undefined;

  if (isIgnored) {
    return <Block className={classes.blockAvatar} />;
  }

  return (
    <Avatar className={classes.userAvatar} style={{ backgroundColor: color }} onClick={onClick}>
      {userName ? userName : '?'}
    </Avatar>
  );
};

export default TagAvatar;
