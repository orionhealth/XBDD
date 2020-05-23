import React, { FC, MouseEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import { Block } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { User } from 'models/User';
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
  user?: User;
  isIgnored: boolean;
  onClick(event: MouseEvent): void;
}

const TagAvatar: FC<Props> = ({ user, isIgnored, onClick }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  if (isIgnored) {
    return (
      <span title={t('tags.blocked')}>
        <Block className={classes.blockAvatar} />
      </span>
    );
  }

  return <UserAvatar className={classes.userAvatar} user={user || null} onClick={onClick} />;
};

export default TagAvatar;
