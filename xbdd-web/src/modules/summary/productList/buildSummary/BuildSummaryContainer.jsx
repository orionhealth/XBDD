import React from "react";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid, TextField, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import BuildSummaryStyles from "./styles/BuildSummaryStyles";
import BuildList from "./buildList/BuildList";

const buildMenuItem = version => {
  const versionString = `${version.major}.${version.minor}.${version.servicePack}`;
  return (
    <MenuItem value={versionString} key={versionString}>
      {versionString}
    </MenuItem>
  );
};

const BuildSummaryContainer = props => {
  var value = 10;
  const pinnedBuild = "Build 12";
  const versionList = props.product.versionList;

  function handleChange(event) {
    value = event.target.value;
  }

  return (
    <Grid container>
      <Grid item xs={3} className={props.classes.buildSummaryContainer}>
        <FormControl variant="outlined" style={{ paddingBottom: "10px" }}>
          <InputLabel>Versions</InputLabel>
          <Select value={value} onChange={e => handleChange(e)} input={<OutlinedInput labelWidth={50} />}>
            {versionList.map(buildMenuItem)}
          </Select>
        </FormControl>
        <Divider />
        <TextField label="Pinned" value={pinnedBuild} variant="outlined" style={{ marginTop: "20px" }} />
      </Grid>
      <Grid item xs={9}>
        <BuildList buildList={props.product.versionList[0].buildList} />
      </Grid>
    </Grid>
  );
};

export default withStyles(BuildSummaryStyles)(BuildSummaryContainer);
