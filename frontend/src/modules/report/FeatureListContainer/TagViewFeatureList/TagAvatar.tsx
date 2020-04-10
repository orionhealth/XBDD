import React, { FC, MouseEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { TagAssignee } from 'models/TagAssignee';
import UserAvatar from 'modules/userAvatar/UserAvatar';

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
  tagAssignee?: TagAssignee;
  isIgnored: boolean;
  onClick(event: MouseEvent): void;
}

const TagAvatar: FC<Props> = ({ tagAssignee, isIgnored, onClick }) => {
  const classes = useStyles();

  if (isIgnored) {
    return <Block className={classes.blockAvatar} />;
  }

  return (
    <UserAvatar className={classes.userAvatar} userName={tagAssignee?.userName} avatarUrl={tagAssignee?.avatarUrl} onClick={onClick} />
  );
};

export default TagAvatar;
