const tagListStyles = {
  xbddTagList: {
    borderRadius: "0 0 4px 4px",
    height: "100%",
    overflow: "scroll",
    position: "relative",
    width: "100%",
  },
};

const tagListItemStyles = {
  listItemIcon: {
    minWidth: "36px",
    fontSize: "20px",
    color: "#6fc1f5",
  },
  xbddTagListItemContainer: {
    width: "100%",
  },
  xbddTagListItemContainerExpanded: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  xbddFeatureListContainer: {
    paddingLeft: "30px",
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

export { tagListStyles, tagListItemStyles };
