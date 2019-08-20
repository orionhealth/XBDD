import React from "react";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import BuildSummaryStyles from "./styles/BuildSummaryStyles";
import BuildList from "./buildList/BuildList";

const getVersionString = version => {
  return `${version.major}.${version.minor}.${version.servicePack}`;
};

const buildVersionList = version => {
  const versionString = getVersionString(version);
  return (
    <MenuItem value={versionString} key={versionString}>
      {versionString}
    </MenuItem>
  );
};

const BuildSummaryContainer = props => {
  const versionList = props.product.versionList;

  return (
    <Grid container>
      <Grid item xs={3} className={props.classes.buildSummaryContainer}>
        <FormControl variant="outlined" style={{ paddingBottom: "10px" }}>
          <InputLabel>Versions</InputLabel>
          <Select
            value={getVersionString(props.version)}
            onChange={e => props.handleVersionSelected(e, props.product)}
            input={<OutlinedInput labelWidth={50} />}
          >
            {versionList.map(buildVersionList)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <BuildList product={props.product} versionList={versionList} version={props.version} handlePinChange={props.handlePinChange} />
      </Grid>
    </Grid>
  );
};

export default withStyles(BuildSummaryStyles)(BuildSummaryContainer);
