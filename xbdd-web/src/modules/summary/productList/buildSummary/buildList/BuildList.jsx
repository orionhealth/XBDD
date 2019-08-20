import React from "react";
import clsx from "clsx";
import { loadCSS } from "fg-loadcss";
import { List, ListItem, Icon, ListItemIcon, ListItemText, Checkbox } from "@material-ui/core";

const getVersionString = version => {
  return `${version.major}.${version.minor}.${version.servicePack}`;
};

const getBuildListByVersion = (versionList, versionString) => {
  var selectedVersion = versionList.find(item => versionString === getVersionString(item));
  if (selectedVersion) {
    return selectedVersion.buildList;
  }
  return selectedVersion;
};

const getPinnedBuildList = (versionList, versionString) => {
  var selectedVersion = versionList.find(item => versionString === getVersionString(item));
  if (selectedVersion) {
    return selectedVersion.pinnedBuildList;
  }
  return null;
};

const checkBuildPinStatus = (pinnedBuildList, build) =>
  pinnedBuildList &&
  pinnedBuildList.some(pinnedBuild => {
    return pinnedBuild === build;
  });

const getOtherBuildList = (buildList, pinnedBuildList) => buildList.filter(build => !checkBuildPinStatus(pinnedBuildList, build));

const BuildList = props => {
  React.useEffect(() => {
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css", document.querySelector("#font-awesome-css"));
  }, []);

  const product = props.product;
  const versionString = getVersionString(props.version);
  const buildList = getBuildListByVersion(props.versionList, versionString);
  const pinnedBuildList = getPinnedBuildList(props.versionList, versionString);
  const otherBuildList = getOtherBuildList(buildList, pinnedBuildList);

  return (
    <>
      <List>
        {pinnedBuildList &&
          pinnedBuildList.map(build => (
            <ListItem button divider key={build}>
              <ListItemText>Build {build}</ListItemText>
              <ListItemIcon>
                <Checkbox
                  icon={<Icon className={clsx("fas fa-thumbtack")} />}
                  checkedIcon={<Icon className={clsx("fas fa-thumbtack")} />}
                  checked={true}
                  onClick={e => props.handlePinChange(e, product, build, true, props.version)}
                />
              </ListItemIcon>
            </ListItem>
          ))}
      </List>

      <List>
        {otherBuildList &&
          otherBuildList.map(build => (
            <ListItem button divider key={build}>
              <ListItemText>Build {build}</ListItemText>
              <ListItemIcon>
                <Checkbox
                  icon={<Icon className={clsx("fas fa-thumbtack")} />}
                  checkedIcon={<Icon className={clsx("fas fa-thumbtack")} />}
                  checked={false}
                  onClick={e => props.handlePinChange(e, product, build, false, props.version)}
                />
              </ListItemIcon>
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default BuildList;
