import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleUp, faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";
import { buildListStyles } from "./styles/BuildListStyles";
import Product from "../../../../../models/Product";
import Version from "../../../../../models/Version";
import BuildListItem from "./BuildListItem";

const clickEventWrapper = (event, product, version, build, isPinned, handlePinChange, handleBuildSelected) => {
  let node = event.target;

  while (node) {
    if (node.className === "MuiIconButton-label") {
      handlePinChange(product, version, build, isPinned);
      return;
    }
    node = node.parentNode;
  }
  handleBuildSelected(product.name, version.getString(), build);
};

const BuildList = props => {
  const { product, version, expandedBuildList, handlePinChange, handleBuildSelected, handleBuildListExpanded, classes } = props;
  const pinnedBuildList = version.pinnedBuildList;
  let unpinnedBuildList = version.getUnpinnedBuildList();
  const productVersionId = `${product.name} ${version.getString()}`;
  const isBuildListExpanded = expandedBuildList.includes(productVersionId);
  const isBigBuildList = unpinnedBuildList.length > 5;

  if (isBigBuildList && !isBuildListExpanded) {
    unpinnedBuildList = unpinnedBuildList.slice(0, 5);
  }

  const renderBuildListByPin = (buildList, isPinned) => (
    <List>
      <BuildListItem
        product={product}
        version={version}
        isPinned={isPinned}
        buildList={buildList}
        handlePinChange={handlePinChange}
        handleBuildSelected={handleBuildSelected}
        clickEventWrapper={clickEventWrapper}
      />
      {isPinned || !isBigBuildList ? null : (
        <ListItem button divider className={classes.buildListItem} onClick={() => handleBuildListExpanded(productVersionId)}>
          <ListItemIcon className={classes.arrowIcon}>
            <FontAwesomeIcon icon={isBuildListExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
          </ListItemIcon>
          <ListItemText>{isBuildListExpanded ? "Show Less" : "Show More..."}</ListItemText>
        </ListItem>
      )}
    </List>
  );

  return (
    <div className={classes.buildListContainer}>
      {pinnedBuildList.length !== 0 ? renderBuildListByPin(pinnedBuildList, true) : null}
      {unpinnedBuildList.length !== 0 ? renderBuildListByPin(unpinnedBuildList, false) : null}
    </div>
  );
};

BuildList.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.instanceOf(Version),
  expandedBuildList: PropTypes.arrayOf(PropTypes.string),
  handlePinChange: PropTypes.func.isRequired,
  handleBuildSelected: PropTypes.func.isRequired,
  handleBuildListExpanded: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(buildListStyles)(BuildList);
