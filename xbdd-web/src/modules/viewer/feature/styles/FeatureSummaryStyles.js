const featureSummaryStyles = theme => ({
  featureSummaryViewContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: "24px",
    paddingLeft: "0px",
    borderRadius: "0 0 10px 0",
    height: 'calc(100vh - 115px)', // 64px for navbar, 5px navbar margin, 48px in padding, 48px buttons, 15px button margins
    position: "relative",
  },
  buildHistoryViewContainer: {
    borderRadius: "5px",
    padding: "20px",
    backgroundColor: theme.palette.background.paper,
  },
});

export { featureSummaryStyles };
