import React, { FC } from 'react';
import { Avatar } from '@material-ui/core';

import { User } from 'models/User';

const getInitials = (user: User): string => {
  let initials;
  const nameParts = user.name?.split(' ');

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

interface Props {
  user: User | null;
}

const UserAvatar: FC<Props> = ({ user }) => {
  if (user) {
    const initials = user.name && getInitials(user);

    if (user.avatarUrl) {
      return <Avatar src={user?.avatarUrl} alt={initials} />;
    } else {
      return <Avatar>{initials}</Avatar>;
    }
  }

  return <Avatar />;
};

export default UserAvatar;
