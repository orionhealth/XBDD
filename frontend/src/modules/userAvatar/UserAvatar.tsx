import React, { FC, MouseEvent } from 'react';
import { Avatar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { LoggedInUser } from 'models/User';

const getInitials = (userName: string): string => {
  let initials;
  const nameParts = userName?.split(' ');

  if (nameParts) {
    if (nameParts.length > 1) {
      initials = `${nameParts[0][0].toUpperCase()}${nameParts[nameParts.length - 1][0].toUpperCase()}`;
    } else if (nameParts.length === 1) {
      initials = nameParts[0][0].toUpperCase();
    }
  }

  if (!initials) {
    initials = 'X';
  }

  return initials;
};

const getHSLFromString = (display: string): string => {
  let val = 0;
  for (let i = 0; i < display.length; i++) {
    val += display.charCodeAt(i);
  }
  return 'hsl(' + ((val * val) % 360) + ', 21%, 63%)';
};

interface Props {
  user: LoggedInUser | null;
  className?: string;
  onClick?(e: MouseEvent): void;
}

const UserAvatar: FC<Props> = ({ user, className, onClick }) => {
  const { t } = useTranslation();
  let initials;
  let color;

  if (user) {
    initials = getInitials(user.display);
    color = getHSLFromString(user.display);
  }

  if (user?.avatarUrl) {
    return <Avatar className={className} src={user.avatarUrl} alt={initials} title={user?.display} onClick={onClick} />;
  } else if (initials) {
    return (
      <Avatar className={className} onClick={onClick} alt={initials} title={user?.display} style={{ backgroundColor: color }}>
        {initials}
      </Avatar>
    );
  }

  return <Avatar className={className} onClick={onClick} title={t('tags.unassigned')} />;
};

export default UserAvatar;
