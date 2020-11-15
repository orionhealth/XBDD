import { makeStyles, createStyles } from '@material-ui/core';

export const useTagListItemStyles = makeStyles(() =>
  createStyles({
    listItemIcon: {
      minWidth: '36px',
      fontSize: '20px',
      color: '#6fc1f5',
    },
    checkboxIcons: {
      marginRight: '12px',
      fontSize: '20px',
    },
    listItem: {
      padding: '8px 16px',
    },
  })
);

export const useTagAvatarStyles = makeStyles(() =>
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
