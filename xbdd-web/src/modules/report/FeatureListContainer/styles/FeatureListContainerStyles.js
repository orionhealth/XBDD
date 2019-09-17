const featureListContainerStyles = {
  featureListTitle: {
    alignItems: "center",
    padding: "10px 10px 10px 20px",
    borderRadius: "4px 4px 0 0",
    backgroundColor: "#457B9D",
    color: "white",
    textAlign: "left",
  },
  xbddTagListContainer: {
    padding: "12px 24px 24px 24px",
  },
  tagIcon: {
    textAlign: "right",
  },
  checkedIcon: {
    color: "#6ac5ff",
    fontSize: "20px",
  },
  unCheckedIcon: {
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
  tags: {
    height: "18px",
    margin: "0 2px",
    background: "#428bca",
    color: "white",
  },
  xbddFeatureListItem: {
    lineHeight: "22px",
    padding: "12px 16px 12px 16px",
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
  xbddFeatureListItemSelected: {
    fontWeight: "bold",
    backgroundColor: "#E0E0E0",
  },
  xbddTagViewFeatureListItem: {
    paddingLeft: "40px",
  },
};

export { featureListContainerStyles, filterButtonStyles, featureListItemStyles };
