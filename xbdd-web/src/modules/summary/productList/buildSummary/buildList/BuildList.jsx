import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { loadCSS } from "fg-loadcss";
import { List, ListItem, Icon, ListItemIcon, ListItemText, Checkbox } from "@material-ui/core";
import Product from "../../../../../models/Product";
import Version from "../../../../../models/Version";

const renderBuildListByPin = (buildList, handlePinChange, product, version, isPinned) => (
  <List>
    {buildList.map(build => (
      <ListItem button divider key={build}>
        <ListItemText>Build {build}</ListItemText>
        <ListItemIcon>
          <Checkbox
            icon={<Icon className={clsx("fas fa-thumbtack")} />}
            checkedIcon={<Icon className={clsx("fas fa-thumbtack")} />}
            checked={isPinned}
            onClick={e => handlePinChange(e, product, version, build, isPinned)}
          />
        </ListItemIcon>
      </ListItem>
    ))}
  </List>
);

const BuildList = props => {
  React.useEffect(() => {
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css", document.querySelector("#font-awesome-css"));
  }, []);

  const { product, version } = props;
  const pinnedBuildList = version.pinnedBuildList;
  const otherBuildList = version.getUnpinnedBuildList();

  return (
    <>
      {renderBuildListByPin(pinnedBuildList, props.handlePinChange, product, version, true)}
      {renderBuildListByPin(otherBuildList, props.handlePinChange, product, version, false)}
    </>
  );
};

BuildList.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.instanceOf(Version),
  handlePinChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default BuildList;
