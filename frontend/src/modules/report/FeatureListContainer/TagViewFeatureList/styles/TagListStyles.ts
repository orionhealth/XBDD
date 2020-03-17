import { createStyles } from '@material-ui/core';

const tagListStyles = createStyles({
  tagList: {
    borderRadius: '0 0 4px 4px',
    height: '100%',
    overflow: 'scroll',
    position: 'relative',
    width: '100%',
  },
});

const tagListItemStyles = createStyles({
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
  ignoredColor: {
    color: '#bdbdbd',
  },
  ignoredListItem: {
    padding: '8px 40px 8px 16px',
  },
});

export { tagListStyles, tagListItemStyles };
