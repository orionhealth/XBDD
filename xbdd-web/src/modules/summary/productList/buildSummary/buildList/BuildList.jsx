import React from "react";
import { List, ListItem } from "@material-ui/core";

const BuildList = props => {
  return (
    <List>
      {props.buildList.map(build => (
        <ListItem button divider>
          Build {build}
        </ListItem>
      ))}
    </List>
  );
};

export default BuildList;
