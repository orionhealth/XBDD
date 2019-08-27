const tagListStyles = theme => ({
  xbddTagListContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "0 0 0 10px",
    padding: "24px",
    position: "relative",
  },
  xbddTagList: {
    backgroundColor: theme.palette.background.paper,
    // border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: "5px",
    height: "calc(100vh - 180px)", // 64px for navbar, 5px navbar margin, 48px in padding, 48px buttons, 15px button margins
    overflow: "scroll",
    position: "relative",
    width: "100%",
    // width: 'calc(100% - 2px)',
  },
  xbddTagListFilterButtons: {
    borderRadius: "5px",
    height: "50px",
    width: "100%",
  },
  xbddFilterButton: {
    width: 90,
  },
});

const tagListFilterButtonStyles = theme => ({
  xbddTagListFilterButtons: {
    backgroundColor: theme.palette.background.paper,
    height: "48px",
    marginBottom: "15px",
    width: "100%",
  },
  xbddFilterButton: {
    // border: '1px solid rgba(0, 0, 0, 0.23)',
    height: "calc(100% - 4px)",
    marginTop: "2px",
    marginBottom: "2px",
    borderRadius: 0,
    width: "25%",
    borderRight: "1px solid rgba(0, 0, 0, 0.23)",
  },
  xbddFilterButtonPassed: {
    color: "#1d3557",
  },
  xbddFilterButtonFailed: {
    color: "#E63946",
  },
  xbddFilterButtonUndefined: {
    color: "#A8DADC",
  },
  xbddFilterButtonSkipped: {
    color: "#457B9D",
    borderRight: "hidden",
  },
  xbddFilterButtonUnselected: {
    color: "#E0E0E0",
  },
});

const tagListItemStyles = {
  xbddTagListItemContainer: {
    width: "100%",
  },
  xbddTagListItemContainerSelected: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
};

export { tagListStyles, tagListFilterButtonStyles, tagListItemStyles };
