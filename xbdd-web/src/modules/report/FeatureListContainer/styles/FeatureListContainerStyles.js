const featureListContainerStyles = {
  featureListTitle: {
    alignItems: "center",
    padding: "10px",
    borderRadius: "4px 4px 0 0",
    backgroundColor: "#457B9D",
    color: "white",
    textAlign: "center",
  },
  xbddTagListContainer: {
    padding: "12px 24px 24px 24px",
  },
  checkedIcon: {
    color: "#00ffec",
    fontSize: "20px",
  },
  unCheckedIcon: {
    color: "#000000",
    fontSize: "20px",
  },
};

const filterButtonStyles = {
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

const featureListItemStyles = {
  xbddFeatureListItem: {
    display: "inline-block",
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
};

export { featureListContainerStyles, filterButtonStyles, featureListItemStyles };
