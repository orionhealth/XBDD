import React, { FC, MouseEvent } from 'react';
import { Avatar } from '@material-ui/core';

import { User } from 'models/User';

const getInitials = (userName: string): string => {
  let initials;
  const nameParts = userName?.split(' ');

  if (nameParts) {
    if (nameParts.length > 1) {
      initials = `${nameParts[0][0].toUpperCase()}${nameParts[nameParts.length - 1][0].toUpperCase()}`;
    } else if (nameParts.length === 1) {
      initials = nameParts[0].toUpperCase();
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
  user: User | null;
  className?: string;
  onClick?(event: MouseEvent): void;
}

const UserAvatar: FC<Props> = ({ user, className, onClick }) => {
  let initials;
  let color;

  if (user) {
    initials = getInitials(user.display);
    color = getHSLFromString(user.display);
  }

  if (user?.avatarUrl) {
    return <Avatar className={className} src={user.avatarUrl} alt={initials} onClick={onClick} style={{ backgroundColor: color }} />;
  } else if (initials) {
    return (
      <Avatar className={className} onClick={onClick} style={{ backgroundColor: color }}>
        {initials}
      </Avatar>
    );
  }

  return <Avatar className={className} onClick={onClick} />;
};

export default UserAvatar;
