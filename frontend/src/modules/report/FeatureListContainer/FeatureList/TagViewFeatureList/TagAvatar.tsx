import React, { FC, MouseEvent } from 'react';
import { Block } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { User } from 'models/User';
import UserAvatar from 'modules/userAvatar/UserAvatar';
import { useTagAvatarStyles } from './styles/TagListStyles';

interface Props {
  user?: User;
  isIgnored: boolean;
  onClick(e: MouseEvent): void;
}

const TagAvatar: FC<Props> = ({ user, isIgnored, onClick }) => {
  const classes = useTagAvatarStyles();
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
