import React, { FC, MouseEvent } from 'react';
import { Avatar } from '@material-ui/core';

import { UserName } from 'models/User';

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
  userName?: UserName;
  avatarUrl?: string;
  className?: string;
  onClick?(event: MouseEvent): void;
}

const UserAvatar: FC<Props> = ({ userName, avatarUrl, className, onClick }) => {
  const initials = userName && getInitials(userName);

  const color = userName && getHSLFromString(userName);

  if (avatarUrl) {
    return <Avatar className={className} src={avatarUrl} alt={initials} onClick={onClick} style={{ backgroundColor: color }} />;
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
