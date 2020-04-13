import React, { FC, MouseEvent } from 'react';
import { Avatar } from '@material-ui/core';

import { User } from 'models/User';

const getInitials = (userName): string => {
  let initials;
  const nameParts = userName && userName?.split(' ');

  if (nameParts) {
    if (nameParts.length > 1) {
      initials = `${nameParts[0].toUpperCase()}${nameParts[nameParts.length - 1].toUpperCase()}`;
    } else if (nameParts.length === 1) {
      initials = nameParts[0].toUpperCase();
    }
  }

  if (!initials) {
    initials = 'X';
  }

  return initials;
};

const getHSLFromString = (string: string): string => {
  let val = 0;
  for (let i = 0; i < string.length; i++) {
    val += string.charCodeAt(i);
  }
  return 'hsl(' + ((val * val) % 360) + ', 21%, 63%)';
};

interface Props {
  user: User | null;
  className?: string;
  onClick?(event: MouseEvent): void;
}

const UserAvatar: FC<Props> = ({ user, className, onClick }) => {
  const initials = user?.name && getInitials(user.name);

  const color = user?.name && getHSLFromString(user.name);

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
