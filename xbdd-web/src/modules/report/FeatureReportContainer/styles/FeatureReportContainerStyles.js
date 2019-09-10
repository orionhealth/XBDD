const featureSummaryStyles = {
  featureSummary: {
    padding: "24px",
    margin: "24px",
  },
  tags: {
    fontSize: "14px",
    background: "#428bca",
    color: "white",
  },
  xbddFeatureListItem: {
    padding: "12px 16px 12px 16px",
    display: "inline-block",
  },
  xbddFeatureStatus: {
    display: "inline-flex",
  },
  xbddFeatureListIcons: {
    fontSize: "16px",
  },
  xbddFeatureListItemPassed: {
    color: "#576E5D",
  },
  xbddFeatureListItemFailed: {
    color: "#AC534F",
  },
  xbddFeatureListItemUndefined: {
    color: "#C39575",
  },
  xbddFeatureListItemSkipped: {
    color: "#457B9D",
  },
  xbddFeatureListItemArrow: {
    fontSize: "16px",
    color: "#999",
  },
  xbddTagViewFeatureList: {
    paddingLeft: "40px",
  },
};

const featureListStyles = {
  xbddFilterButtons: {
    padding: "24px 24px 12px 24px",
  },
  xbddFilterButton: {
    height: "calc(100% - 4px)",
    marginTop: "2px",
    marginBottom: "2px",
    borderRadius: 0,
    width: "25%",
    borderRight: "1px solid rgba(0, 0, 0, 0.23)",
  },
  xbddFilterButtonPassed: {
    color: "#576E5D",
  },
  xbddFilterButtonFailed: {
    color: "#AC534F",
  },
  xbddFilterButtonUndefined: {
    color: "#C39575",
  },
  xbddFilterButtonSkipped: {
    color: "#457B9D",
    borderRight: "hidden",
  },
  xbddFilterButtonUnselected: {
    color: "#E0E0E0",
  },
};

export { featureSummaryStyles, featureListStyles };
