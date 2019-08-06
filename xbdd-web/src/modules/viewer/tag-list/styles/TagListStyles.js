const tagListStyles = theme => ({
  xbddTagListContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "0 0 0 10px",
    padding: '24px',
    position: 'relative',
  },
  xbddTagList: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    maxHeight: 'calc(100vh - 180px)', // 64px for navbar, 5px navbar margin, 48px in padding, 48px buttons, 15px button margins
    overflowY: 'scroll',
    position: 'relative',
    width: 'calc(100% - 2px)',
  },
  xbddTagListFilterButtons: {
    borderRadius: '5px',
    height: '50px',
    width: '100%',
  },
  xbddFilterButton: {
    width: 90,
  },
});

const tagListFilterButtonStyles = theme => ({
  xbddFilterButtonIcon: {
    fontSize: 20,
  },
  xbddTagListFilterButtons: {
    backgroundColor: theme.palette.background.paper,
    height: '48px',
    marginBottom: '15px',
    width: '100%',
  },
  xbddFilterButton: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 0,
    borderRight: 0,
    width: '25%',
  },
  xbddFilterButtonFirst: {
    borderRadius: '3px 0 0 3px',
  },
  xbddFilterButtonLast: {
    borderRadius: '0 3px 3px 0',
    borderRight: '1px solid rgba(0, 0, 0, 0.23)',
  },
});

const tagListItemStyles = {
  xbddTagListItemContainer: {
    width: '100%',
  },
  xbddTagListItemContainerSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
};

export { tagListStyles, tagListFilterButtonStyles, tagListItemStyles };
