import React, { FC, MouseEvent } from 'react';
import { Avatar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { User } from 'models/User';

interface Props {
  user: User | null;
  className?: string;
  onClick?(event: MouseEvent): void;
}

const getInitials = (userName: string): string => {
  let initials: string | undefined;
  const nameParts = userName?.trim().split(' ');

  if (nameParts) {
    if (nameParts.length > 1) {
      initials = `${nameParts[0][0].toUpperCase()}${nameParts[nameParts.length - 1][0].toUpperCase()}`;
    } else if (nameParts.length === 1) {
      initials = nameParts[0][0].toUpperCase();
    }
  }

  return initials || 'X';
};

const getHSLFromString = (display: string): string => {
  let val = 0;
  for (let i = 0; i < display.length; i++) {
    val += display.charCodeAt(i);
  }
  return 'hsl(' + ((val * val) % 360) + ', 21%, 63%)';
};

const UserAvatar: FC<Props> = ({ user, className, onClick }) => {
  const { t } = useTranslation();

  if (user?.avatarUrl) {
    return <Avatar className={className} src={user.avatarUrl} alt={user.display} title={user.display} onClick={onClick} />;
  } else if (user) {
    const initials = getInitials(user.display);
    const color = getHSLFromString(user.display);

    return (
      <Avatar className={className} onClick={onClick} alt={user.display} title={user.display} style={{ backgroundColor: color }}>
        {initials}
      </Avatar>
    );
  }

  return <Avatar className={className} onClick={onClick} title={t('tags.unassigned')} />;
};

export default UserAvatar;
